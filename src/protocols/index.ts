export interface Carrier {
  id: number;
  name: string;
  code: number;
}
export interface Phone {
  id: number;
  number: string;
  carrier_id: number
  cpf: number;
  description: string
}

export interface Recharge {
  id: number;
  phone_id: number;    
  value: number;   
  recharge_date: string;
}
export interface SummaryResponse {
  document: string;
  phones: Array<{
    id: number;
    number: string;
    cpf: number;
    carrier: {
      id: number;
      name: string;
      code: number;
    };
    recharges: Array<{
      id: number;
      value: number;
      recharge_date: Date;
    }>;
  }>;
}

export interface ParamsWithDocument {
  document: string;
}

export interface PhoneWithCarrier extends Phone {
  carrier_name: string;
  carrier_code: number;
}

