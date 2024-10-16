export interface Carrier {
  id: number;
  name: string;
  code: number;
}

export interface Customer {
  id: number;
  document: string;
  name: string;
}

export interface Phone {
  id: number;
  number: string;
  carrier_id: number;
  customer_id: number;
}

export interface Recharge {
  id: number;
  phone_id: number;
  value: number;
  created_at: Date;
}

export interface ParamsWithDocument {
  document: string;
}
