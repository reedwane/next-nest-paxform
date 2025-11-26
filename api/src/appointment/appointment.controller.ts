import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery as SwaggerApiQuery,
} from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Public } from '../auth/decorators/public.decorator';
import {
  ApiQuery,
  type QueryParams,
  type PaginatedResult,
} from '../common/decorators/api-query.decorator';
import type { Appointment } from './entities/appointment.entity';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new appointment (Public)' })
  @ApiResponse({
    status: 201,
    description: 'Appointment created and synced to Google Calendar',
  })
  @ApiResponse({
    status: 409,
    description:
      'Time slot not available - conflicts with existing appointment',
  })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all appointments with pagination and filtering (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Returns paginated appointments' })
  @SwaggerApiQuery({
    name: '_page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @SwaggerApiQuery({
    name: '_limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @SwaggerApiQuery({
    name: '_sort',
    required: false,
    type: String,
    description: 'Sort field',
  })
  @SwaggerApiQuery({
    name: '_order',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order',
  })
  @SwaggerApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Filter by email',
  })
  @SwaggerApiQuery({
    name: 'name_like',
    required: false,
    type: String,
    description: 'Search by name (case-insensitive)',
  })
  async findAll(
    @ApiQuery() query: QueryParams,
  ): Promise<PaginatedResult<Appointment>> {
    return this.appointmentService.findAllPaginated(query);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get appointment by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns appointment details' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update appointment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete appointment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
