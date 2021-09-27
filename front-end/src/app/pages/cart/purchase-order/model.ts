export interface UserInfo {
  city: string;
  district: string;
  address: string;
  phone: string;
}

export interface PurchaseInfo {
  phone: string;
  city: string;
  district: string;
  address: string;
  contractsChecked: boolean;
}

export interface City {
  city: string;
  code: number;
  districts: string[];
}

export interface PaymentReqResponse {
  checkoutFormContent?: string;
  locale?: string;
  payWithIyzicoPageUrl?: string;
  paymentPageUrl?: string;
  status?: string;
  systemTime?: number;
  token?: string;
  tokenExpireTime?: number;
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
}
