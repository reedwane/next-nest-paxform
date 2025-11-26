import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Between } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { GoogleCalendarService } from './google-calendar.service';
import {
  type QueryParams,
  type PaginatedResult,
  buildWhereConditions,
  buildOrderConditions,
  buildPaginationOptions,
} from '../common/decorators/api-query.decorator';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private googleCalendarService: GoogleCalendarService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const appointmentDateTime = new Date(
      createAppointmentDto.appointmentDateTime,
    );

    // Check for time slot conflicts (30-minute duration)
    await this.validateTimeSlot(appointmentDateTime);

    const googleEventId = await this.googleCalendarService.createEvent(
      createAppointmentDto.name,
      createAppointmentDto.email,
      appointmentDateTime,
      createAppointmentDto.notes,
    );

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      appointmentDateTime,
      googleEventId,
    });

    return this.appointmentRepository.save(appointment);
  }

  private async validateTimeSlot(appointmentDateTime: Date): Promise<void> {
    const APPOINTMENT_DURATION_MS = 30 * 60 * 1000; // 30 minutes in milliseconds
    const startTime = new Date(appointmentDateTime.getTime());
    const endTime = new Date(
      appointmentDateTime.getTime() + APPOINTMENT_DURATION_MS,
    );

    // Check for overlapping appointments
    // An appointment conflicts if it starts within 30 minutes before or after the requested time
    const conflictStart = new Date(
      startTime.getTime() - APPOINTMENT_DURATION_MS,
    );
    const conflictEnd = new Date(endTime.getTime());

    const conflictingAppointment = await this.appointmentRepository.findOne({
      where: {
        appointmentDateTime: Between(conflictStart, conflictEnd),
      },
    });

    if (conflictingAppointment) {
      throw new ConflictException(
        `Time slot not available. An appointment already exists at ${conflictingAppointment.appointmentDateTime.toLocaleString()}. Please choose a time at least 30 minutes before or after existing appointments.`,
      );
    }
  }

  async findAll() {
    return this.appointmentRepository.find({
      order: { appointmentDateTime: 'DESC' },
    });
  }

  async findByEmail(email: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { email },
      order: { appointmentDateTime: 'DESC' },
    });
  }

  async findAllWithQuery(
    options: FindManyOptions<Appointment>,
  ): Promise<[Appointment[], number]> {
    return this.appointmentRepository.findAndCount(options);
  }

  async findAllPaginated(
    query: QueryParams,
  ): Promise<PaginatedResult<Appointment>> {
    const searchableFields = ['name', 'email', 'notes'];
    const where = buildWhereConditions<Appointment>(query, searchableFields);
    const order = buildOrderConditions<Appointment>(query);
    const { skip, take, page, limit } = buildPaginationOptions(query);

    const [data, total] = await this.appointmentRepository.findAndCount({
      where,
      order,
      skip,
      take,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.findOne(id);

    // Update appointment fields
    Object.assign(appointment, updateAppointmentDto);

    // If appointmentDateTime is being updated, convert to Date
    if (updateAppointmentDto.appointmentDateTime) {
      appointment.appointmentDateTime = new Date(
        updateAppointmentDto.appointmentDateTime,
      );
    }

    // Sync with Google Calendar if event exists
    if (appointment.googleEventId) {
      await this.googleCalendarService.updateEvent(
        appointment.googleEventId,
        appointment.name,
        appointment.email,
        appointment.appointmentDateTime,
        appointment.notes || undefined,
      );
    }

    return this.appointmentRepository.save(appointment);
  }

  async remove(id: string) {
    const appointment = await this.findOne(id);

    // Delete from Google Calendar if event exists
    if (appointment.googleEventId) {
      await this.googleCalendarService.deleteEvent(appointment.googleEventId);
    }

    await this.appointmentRepository.remove(appointment);
    return { message: 'Appointment deleted successfully' };
  }
}
