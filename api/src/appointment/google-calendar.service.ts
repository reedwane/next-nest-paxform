import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private calendar;

  constructor(private configService: ConfigService) {
    const oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GOOGLE_REDIRECT_URI'),
    );

    oauth2Client.setCredentials({
      refresh_token: this.configService.get('GOOGLE_REFRESH_TOKEN'),
    });

    this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  }

  async createEvent(
    name: string,
    email: string,
    appointmentDateTime: Date,
    notes?: string,
  ): Promise<string | null> {
    try {
      const endDateTime = new Date(appointmentDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + 30); // 30-minute appointment

      const event = {
        summary: `Appointment with ${name}`,
        description: notes || 'No additional notes',
        start: { dateTime: appointmentDateTime.toISOString(), timeZone: 'UTC' },
        end: { dateTime: endDateTime.toISOString(), timeZone: 'UTC' },
        attendees: [{ email }],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 1440 },
            { method: 'popup', minutes: 30 },
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        sendUpdates: 'all',
      });

      this.logger.log(`Google Calendar event created: ${response.data.id}`);
      return response.data.id;
    } catch (error) {
      this.logger.error('Failed to create Google Calendar event', error);
      return null;
    }
  }

  async updateEvent(
    eventId: string,
    name: string,
    email: string,
    appointmentDateTime: Date,
    notes?: string,
  ): Promise<boolean> {
    try {
      const endDateTime = new Date(appointmentDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + 30); // 30-minute appointment

      const event = {
        summary: `Appointment with ${name}`,
        description: notes || 'No additional notes',
        start: { dateTime: appointmentDateTime.toISOString(), timeZone: 'UTC' },
        end: { dateTime: endDateTime.toISOString(), timeZone: 'UTC' },
        attendees: [{ email }],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 1440 },
            { method: 'popup', minutes: 30 },
          ],
        },
      };

      await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        requestBody: event,
        sendUpdates: 'all',
      });

      this.logger.log(`Google Calendar event updated: ${eventId}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to update Google Calendar event', error);
      return false;
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all',
      });

      this.logger.log(`Google Calendar event deleted: ${eventId}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to delete Google Calendar event', error);
      return false;
    }
  }
}
