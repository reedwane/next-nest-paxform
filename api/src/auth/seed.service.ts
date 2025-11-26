import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedSuperAdmin();
  }

  private async seedSuperAdmin() {
    const superAdminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL');
    const superAdminPassword = this.configService.get<string>(
      'SUPER_ADMIN_PASSWORD',
    );

    if (!superAdminEmail || !superAdminPassword) {
      this.logger.warn(
        'Super admin credentials not found in environment variables. Skipping seed.',
      );
      return;
    }

    // Check if super admin already exists
    const existingSuperAdmin = await this.userRepository.findOne({
      where: { email: superAdminEmail },
    });

    if (existingSuperAdmin) {
      this.logger.log('Super admin already exists. Skipping seed.');
      return;
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
    const superAdmin = this.userRepository.create({
      email: superAdminEmail,
      password: hashedPassword,
      isAdmin: true,
    });

    await this.userRepository.save(superAdmin);
    this.logger.log(
      `Super admin created successfully with email: ${superAdminEmail}`,
    );
  }
}
