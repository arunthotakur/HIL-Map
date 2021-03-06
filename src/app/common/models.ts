export class DrugLocation {
  retailerId: number;
  drugs: DrugInfo[];
}

export class DrugInfo {
  drugId: number;
  discount: number;
}

export class Drug {
  drugId: number;
  drugName: string;
  description: string;
  forms: DrugForm[];
}

export class DrugForm {
  type: string;
  quantity: string;
  unit: number;
  strength: string;
  price: number;
}

export class Retailer {
  retailerId: number;
  retailerName: string;
  address: string;
  longitude: number;
  latitude: number;
  zipcode: number;
  drugPrice: number;
}

export class RetailerAndDrugPrice {
  retailerId: number;
  retailerAddress: string;
  retailerZipcode: number;
  retailerName: string;
  drugId: number;
  price: number;
  latitude: number;
  longitude: number;
}
