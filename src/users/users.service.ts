import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/hashing/hashing.service';
import { Services } from 'src/utils/constants';
import { User } from 'src/utils/typeorm/entities';
import { CreateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(Services.HASHING_SERVICE)
    private readonly hashingService: HashingService,
  ) {}

  async createUser(params: CreateUserParams) {
    const { email, name, password } = params;

    if (await this.userExists(email))
      throw new BadRequestException('A User already exists with this email');

    return await this.userRepository.save(
      this.userRepository.create({
        email,
        name,
        password: await this.hashingService.hashPassword(password),
      }),
    );
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async userExists(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
}
