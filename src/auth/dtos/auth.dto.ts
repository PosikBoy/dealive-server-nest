export class UserAuthDto {
  email: string;
  password: string;
}

export class CourierRegisterDto {
  phoneNumber: string;
  password: string;
  name: string;
  secondName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  documentNumber: string;
  documentFiles: string[];
}

export class CourierLoginDto {
  phoneNumber: string;
  password: string;
}
