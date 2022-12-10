import { Controller, Get, Inject, UseGuards, Param } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { instanceToPlain } from 'class-transformer';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm/entities';
import { UsersService } from './users.service';

@Controller(Routes.USERS)
@UseGuards(AuthenticatedGuard)
export class UsersController {
  constructor(
    @Inject(Services.USERS_SERVICE) private readonly usersService: UsersService,
  ) {}

  @Get('/:id')
  async getUser(@Param('id', ParseIntPipe) id: number, @AuthUser() user: User) {
    if (id === user.id) return instanceToPlain(user);
    return instanceToPlain(this.usersService.findUserById(id));
  }
}
