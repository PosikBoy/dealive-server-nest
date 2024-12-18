import { Address } from '@/addresses/addresses.model';
import { Order } from '../orders.model';
import { OrderAction } from '@/order-actions/order-actions.model';

class AddressWithoutSensitiveInfo {
  id: number;
  orderId: number;
  address: string;
  info: string;
  constructor(address: Address) {
    this.id = address.id;
    this.orderId = address.orderId;
    this.address = address.address;
    this.info = address.info;
  }
}

export class OrderWithoutSensitiveInfoDto {
  id: number;
  date: Date;
  parcelType: string;
  weight: string;
  price: number;
  statusId: number;
  addresses: AddressWithoutSensitiveInfo[];
  actions: OrderAction[];
  constructor(order: Order) {
    this.id = order.id;
    this.date = order.date;
    this.parcelType = order.parcelType;
    this.statusId = order.statusId;
    this.weight = order.weight;
    this.price = order.price;
    this.actions = order.actions;
    this.addresses = order.addresses.map((address) => {
      return new AddressWithoutSensitiveInfo(address);
    });
  }
}
