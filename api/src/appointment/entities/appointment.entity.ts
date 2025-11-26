import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('appointments')
export class Appointment {
  @ApiProperty({ description: 'Appointment ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Appointment holder name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Appointment holder email' })
  @Column()
  email: string;

  @ApiProperty({ description: 'Appointment date and time' })
  @Column({ type: 'timestamp' })
  appointmentDateTime: Date;

  @ApiProperty({ description: 'Additional notes', required: false })
  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ApiProperty({ description: 'Google Calendar Event ID', required: false })
  @Column({ type: 'text', nullable: true })
  googleEventId: string | null;

  @ApiProperty({ description: 'Appointment creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;
}
