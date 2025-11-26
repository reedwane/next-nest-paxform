import { IsEmail, IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'John Doe', description: 'Appointment holder name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Appointment holder email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '2024-12-01T10:00:00Z',
    description: 'Appointment date and time (ISO 8601 format)',
  })
  @IsDateString()
  appointmentDateTime: string;

  @ApiProperty({
    example: 'Discuss project requirements',
    description: 'Additional notes',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
