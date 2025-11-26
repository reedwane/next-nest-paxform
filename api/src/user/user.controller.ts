import {
  Controller,
  Get,
  Post,
  Body,
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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiQuery,
  type QueryParams,
  type PaginatedResult,
} from '../common/decorators/api-query.decorator';
import type { User } from './entities/user.entity';

@ApiTags('Admin - Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new admin user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users with pagination and filtering (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Returns paginated users' })
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
    name: 'email_like',
    required: false,
    type: String,
    description: 'Search by email (case-insensitive)',
  })
  @SwaggerApiQuery({
    name: 'isAdmin',
    required: false,
    type: Boolean,
    description: 'Filter by admin status',
  })
  async findAll(
    @ApiQuery() query: QueryParams,
  ): Promise<PaginatedResult<User>> {
    return this.userService.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns user details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
