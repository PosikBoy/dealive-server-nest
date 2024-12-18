import { User, UserRolesEnum } from '../user.model';

export class UserWithoutSensitiveInfoDto {
  id: number;
  email: string;
  phoneNumber: string;
  role: UserRolesEnum;

  constructor(user: User) {
    this.email = user.email;
    this.id = user.id;
    this.phoneNumber = user.phoneNumber;
    this.role = user.role;
  }
}
