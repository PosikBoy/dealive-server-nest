import { Address } from '@/addresses/addresses.model';
import { Order } from '../orders.model';
import { OrderAction } from '@/order-actions/order-actions.model';

export class IOrderWithGeo {
  id: number;
  clientId?: number;
  date: Date;
  phoneNumber?: string;
  phoneName?: string;
  parcelType: string;
  weight: string;
  statusId: number;
  price: number;
  courierId?: number;
  actions: OrderAction[];
  addresses: AddressWithGeoData[];
}

export class AddressWithGeoData {
  id: number;
  orderId: number;
  address: string;
  floor: string;
  apartment: string;
  phoneNumber: string;
  phoneName: string;
  info: string;
  geoData: any;

  constructor(address: Address, geoData) {
    this.id = address.id;
    this.orderId = address.orderId;
    this.address = address.address;
    this.floor = address.floor;
    this.apartment = address.apartment;
    this.phoneNumber = address.phoneNumber;
    this.phoneName = address.phoneName;
    this.info = address.info;
    this.geoData = geoData;
  }
}

class AddressWithoutSensitiveInfo {
  id: number;
  orderId: number;
  address: string;
  info: string;
  geoData: any;
  constructor(address: AddressWithGeoData) {
    this.id = address.id;
    this.orderId = address.orderId;
    this.address = address.address;
    this.info = address.info;
    this.geoData = address.geoData;
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
  constructor(order: IOrderWithGeo) {
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
