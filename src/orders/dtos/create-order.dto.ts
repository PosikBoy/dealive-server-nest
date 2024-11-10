class Address {
  address: string;
  floor?: string;
  apartment?: string;
  phoneNumber: string;
  phoneName?: string;
  info?: string;
}

class Info {
  userId: number;
  phoneNumber?: string;
  phoneName?: string;
  parcelType: string;
  weight: string;
  price: number;
}

export class CreateOrderDto {
  info: Info;
  addresses: Address[];
}
