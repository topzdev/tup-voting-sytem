import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id): string {
    return `Get User by ID #${id}`;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<string> {
    await this.userService.create(createUserDto);
    return 'User Added Successfully';
  }

  @Put()
  update(@Body() updateUserDto: CreateUserDto): string {
    console.log(updateUserDto);
    return `Updated Users: ${updateUserDto.first_name} ${updateUserDto.last_name} `;
  }

  @Delete('/:id')
  delete(@Param('id') id): string {
    return `Soft Deleting user #${id}`;
  }
}
