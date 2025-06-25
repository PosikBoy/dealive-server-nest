interface Address {
  address: string;
}

export class GetPriceDto {
  readonly parcelType: string;
  readonly weight: string;

  readonly addresses: Address[];
}
