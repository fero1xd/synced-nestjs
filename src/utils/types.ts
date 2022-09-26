import { Request } from 'express';
import { AvailableExtensions, AvailableLanguages } from './enums';
import { User } from './typeorm/entities';
import { Socket } from 'socket.io';

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

export type StartJobParams = GetJobByIdParams;

export type CreateJobParams = {
  projectId: string;
  user: User;
};

export type GetAllJobsParams = {
  user: User;
  id: string;
};

export type GenerateFileParams = {
  extension: AvailableExtensions;
  code: string;
};

export interface AuthenticatedSocket extends Socket {
  user?: User;
}

export type CreateProjectParams = {
  name: string;
  language: AvailableLanguages;
  code: string;
  user: User;
};

export type SaveProjectParams = {
  id: string;
  name?: string;
  language?: AvailableLanguages;
  code?: string;
  user: User;
};

export type DeleteProjectParams = {
  id: string;
  user: User;
};

export type GetProjectByIdParams = DeleteProjectParams;
