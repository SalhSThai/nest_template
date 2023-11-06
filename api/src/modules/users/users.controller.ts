import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedDto } from 'src/globalDtos/paginated.dto';
import { User } from './entities/user.entity';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { ParsePrismaFindManyParamsPipe } from 'src/pipes/parse-prisma-find-many-params.pipe';
import { PrismaFindManyDto } from 'src/globalDtos/prisma-find-many.dto';
import { plainToInstance } from 'class-transformer';
import { RequiresAuth } from '../auth/decorator/requires-auth.decorator';
import { ErrorException } from 'src/error/error.exception';

@Controller('users')
@ApiTags('Users')
@ApiExtraModels(PaginatedDto)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({
    description: 'create user with email and password',
    examples: {
      example: {
        summary: 'create user',
        value: {
          email: 'ccbdigital@gmail.com',
          password: '1234',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: User, description: 'OK' })
  @ApiBadRequestResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorException,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService
      .create(createUserDto)
      .then((result) => plainToInstance(User, result));
  }

  @Get()
  @ApiPaginatedResponse(User, { description: 'OK' })
  async findAll(
    @Query(ParsePrismaFindManyParamsPipe) params: PrismaFindManyDto,
  ) {
    return await this.usersService
      .findAll({ ...params })
      .then((results) =>
        results.map((entity) => plainToInstance(User, entity)),
      );
  }

  @Get(':id')
  @ApiOkResponse({ type: User, description: 'OK' })
  async findOne(@Param('id') id: string) {
    return await this.usersService
      .findOne({ id })
      .then((result) => plainToInstance(User, result));
  }

  @Patch(':id')
  @ApiOkResponse({ type: User, description: 'OK' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService
      .update({ id }, updateUserDto)
      .then((result) => plainToInstance(User, result));
  }

  @Delete(':id')
  @ApiOkResponse({ type: User, description: 'OK' })
  async remove(@Param('id') id: string) {
    return await this.usersService
      .remove({ id })
      .then((result) => plainToInstance(User, result));
  }
}
