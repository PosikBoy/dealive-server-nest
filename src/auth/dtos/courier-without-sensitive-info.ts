import { Courier } from '@/couriers/couriers.model';

export class CourierWithoutSensitiveInfo {
  id: number;
  email: string;
  phoneNumber: string;
  name: string;
  secondName: string;
  lastName: string;
  birthDate: Date;
  isApproved: boolean;

  constructor(courier: Courier) {
    this.id = courier.id;
    this.email = courier.email;
    this.phoneNumber = courier.phoneNumber;
    this.name = courier.name;
    this.secondName = courier.secondName;
    this.lastName = courier.lastName;
    this.birthDate = courier.birthDate;
    this.isApproved = courier.isApproved;
  }
}
