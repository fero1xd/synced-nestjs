import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  async hashPassword(rawPassword: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(rawPassword, salt);
  }

  async compareHash(rawPassword: string, hashedPassword: string) {
    return bcrypt.compare(rawPassword, hashedPassword);
  }
}
