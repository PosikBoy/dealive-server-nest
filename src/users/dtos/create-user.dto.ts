import { UserRolesEnum } from '../user.model';

export interface UserCreateDto {
  phoneNumber?: string;
  email: string;
  hashPass: string;
  role: UserRolesEnum;
}
