import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Services } from 'src/utils/constants';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/utils/typeorm/entities';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(Services.USERS_SERVICE) private readonly usersService: UsersService,
  ) {
    super();
  }

  serializeUser(user: User, done: Function) {
    done(null, user);
  }

  async deserializeUser(user: User, done: Function) {
    const userInDb = await this.usersService.userExists(user.email);
    done(null, userInDb ? userInDb : null);
  }
}
