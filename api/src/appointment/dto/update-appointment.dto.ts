import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(
  OmitType(CreateAppointmentDto, ['email'] as const),
) {}
