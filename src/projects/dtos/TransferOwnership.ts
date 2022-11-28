import { IsEmail, IsNotEmpty } from 'class-validator';

export class TransferOwnership {
  @IsNotEmpty()
  projectId: string;

  @IsNotEmpty()
  @IsEmail()
  userToTransferEmail: string;
}
