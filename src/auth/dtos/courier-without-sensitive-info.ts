import { Courier } from '@/couriers/couriers.model';

export class CourierWithoutSensitiveInfo {
  name: string;
  secondName: string;
  lastName: string;
  birthDate: Date;
  isApproved: boolean;

  constructor(courier: Courier) {
    this.name = courier.name;
    this.secondName = courier.secondName;
    this.lastName = courier.lastName;
    this.birthDate = courier.birthDate;
    this.isApproved = courier.isApproved;
  }
}
