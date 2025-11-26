import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  type QueryParams,
  type PaginatedResult,
  buildWhereConditions,
  buildOrderConditions,
  buildPaginationOptions,
} from '../common/decorators/api-query.decorator';

@Injectable()
export class UserService {
  private readonly superAdminEmail?: string;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.superAdminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL');
  }

  private isSuperAdmin(email: string | undefined): boolean {
    return email === this.superAdminEmail;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map(({ password, ...user }) => user);
  }

  async findAllWithQuery(
    options: FindManyOptions<User>,
  ): Promise<[User[], number]> {
    const [users, total] = await this.userRepository.findAndCount(options);
    const sanitizedUsers = users.map(({ password, ...user }) => user as User);
    return [sanitizedUsers, total];
  }

  async findAllPaginated(query: QueryParams): Promise<PaginatedResult<User>> {
    const searchableFields = ['email'];
    const where = buildWhereConditions<User>(query, searchableFields);
    const order = buildOrderConditions<User>(query);
    const { skip, take, page, limit } = buildPaginationOptions(query);

    const [users, total] = await this.userRepository.findAndCount({
      where,
      order,
      skip,
      take,
    });

    const sanitizedUsers = users.map(({ password, ...user }) => user as User);

    return {
      data: sanitizedUsers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Protect super admin from updates
    if (this.isSuperAdmin(user.email)) {
      throw new ForbiddenException('Cannot update super admin account');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Protect super admin from deletion
    if (this.isSuperAdmin(user.email)) {
      throw new ForbiddenException('Cannot delete super admin account');
    }

    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }
}
