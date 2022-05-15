export interface SiteConfig {
  baseUrl: string;
  mockUrl: string;
  gtagKey: string;
  contact: {
    mailAdress: string;
    phone: {
      value: string;
      text: string;
    };
    address: string;
  };
  social: {
    instagram: string;
    facebook: string;
    whatsApp: string;
  };
}
