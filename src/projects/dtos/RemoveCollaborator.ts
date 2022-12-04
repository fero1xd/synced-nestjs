import { IsEmail, IsNotEmpty } from 'class-validator';

export class RemoveCollaborator {
  @IsNotEmpty()
  projectId: string;

  @IsNotEmpty()
  @IsEmail()
  userToRemoveEmail: string;
}
