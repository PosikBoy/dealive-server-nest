export interface ClientEditInfoDto {
  name: string;
  email: string;
  phoneNumber: string;
}


export class ClientDto {
    id: number;
    email: string;
    name: string;
    phoneNumber: string;
    isNumberConfirmed: boolean;
    isEmailConfirmed: boolean;
}