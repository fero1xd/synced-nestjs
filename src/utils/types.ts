import { Request } from 'express';
import { AvailableLanguages } from './enums';
import { User } from './typeorm/entities';

export type ValidateUserParams = {
  email: string;
  password: string;
};

export type CreateUserParams = ValidateUserParams & {
  name: string;
};

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export type GetJobByIdParams = {
  id: string;
  user: User;
};

export type CreateJobParams = {
  language: AvailableLanguages;
  code: string;
  user: User;
};
