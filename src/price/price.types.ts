export interface PriceOptionsResult {
  basePrice: number;
  options: PriceOption[];
}

export interface PriceOption {
  label: string;
  price: number;
}
