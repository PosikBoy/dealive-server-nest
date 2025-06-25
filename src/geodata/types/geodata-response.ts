export interface Geodata {
  address: string;
  geoLat: number;
  geoLon: number;
  qcGeo: number;
  metro: MetroStation[] | null; // Уточните тип для metro
  beltwayHit: string;
  beltwayDistance: number;
}

interface MetroStation {
  line: string;
  name: string;
  distance: number;
}

export type GeodataResponse = Geodata[];
