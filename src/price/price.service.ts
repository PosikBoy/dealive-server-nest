import { GeodataService } from "@/geodata/geodata.service";
import { Inject, Injectable } from "@nestjs/common";
import { GetPriceDto } from "./dtos/get-price-dto";
import { PriceOption, PriceOptionsResult } from "./price.types";

@Injectable()
export class PriceService {
  constructor(@Inject() private readonly geodataService: GeodataService) {}

  MIN_PRICE = 250;
  PRICE_PER_KM = 23;
  PRICE_FROM_METRO = 60;
  WEIGHT_COEFFS = {
    "До 1 кг": 1,
    "До 5 кг": 1.25,
    "До 10 кг": 1.5,
    "До 15 кг": 2,
  };

  async getPrice(getPriceDto: GetPriceDto): Promise<PriceOptionsResult> {
    const weightCoeff = this.WEIGHT_COEFFS[getPriceDto.weight] || 1.5;

    const enrichedAddresses = await this.geodataService.getAddresses(
      getPriceDto.addresses
    );

    const distanceToMetro = enrichedAddresses.reduce((acc, address) => {
      if (address.metro) {
        return acc + address.metro[0].distance;
      }
      return acc + 2;
    }, 0);

    let distance = -distanceToMetro;

    for (let i = 0; i < enrichedAddresses.length - 1; i++) {
      distance += this.calculateDistance(
        enrichedAddresses[i].geoLat,
        enrichedAddresses[i].geoLon,
        enrichedAddresses[i + 1].geoLat,
        enrichedAddresses[i + 1].geoLon
      );
    }

    const isOutMKAD = enrichedAddresses.some(
      (address) => address.beltwayHit !== "IN_MKAD"
    );

    const price =
      (this.MIN_PRICE +
        this.PRICE_PER_KM * distance +
        this.PRICE_FROM_METRO * distanceToMetro) *
      (isOutMKAD ? 1.2 : 1) *
      weightCoeff;

    const suggestedPrices = this.generatePriceOptions(price);
    return suggestedPrices;
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Радиус Земли в километрах
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // В километрах
    return distance;
  }

  generatePriceOptions(basePrice: number): PriceOptionsResult {
    const priceTiers: { label: string; coef: number }[] = [
      { label: "Эконом", coef: 0.8 },
      { label: "Стандарт", coef: 1.0 },
      { label: "Ускоренная", coef: 1.255 },
      { label: "Приоритет", coef: 1.5 },
    ];

    const options: PriceOption[] = priceTiers.map(({ label, coef }) => ({
      label,
      price: Math.ceil((basePrice * coef) / 10) * 10,
    }));

    // Удаляем дубликаты по цене (если вдруг коэффициенты совпали)
    const uniqueOptions = Array.from(
      new Map(options.map((opt) => [opt.price, opt])).values()
    );

    return {
      basePrice: Math.round(basePrice),
      options: uniqueOptions,
    };
  }
}
