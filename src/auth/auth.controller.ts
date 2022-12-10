import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { CreateUser } from './dtos/CreateUser';
import { instanceToPlain } from 'class-transformer';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { AuthenticatedGuard, LocalAuthGuard } from './utils/Guards';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm/entities';
import { AuthenticatedRequest } from 'src/utils/types';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.USERS_SERVICE) private readonly usersService: UsersService,
  ) {}

  @Post('/register')
  async createUser(@Body() data: CreateUser) {
    return instanceToPlain(await this.usersService.createUser(data));
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Res() res: Response) {
    return res.sendStatus(200);
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  getStatus(@AuthUser() user: User) {
    return instanceToPlain(user);
  }

  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    res.clearCookie('SYNCED_APP_SESSION_ID', {
      path: '/',
    });

    req.session.destroy((err) => {
      res.send(200);
    });
  }
}
