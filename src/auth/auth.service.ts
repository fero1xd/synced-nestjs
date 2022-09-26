import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/hashing/hashing.service';
import { Services } from 'src/utils/constants';
import { User } from 'src/utils/typeorm/entities';
import { ValidateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(Services.HASHING_SERVICE)
    private readonly hashingService: HashingService,
  ) {}

  async validateUser(params: ValidateUserParams) {
    const { email, password } = params;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const isValidPassword = await this.hashingService.compareHash(
      password,
      user.password,
    );

    return isValidPassword ? user : null;
  }
}
