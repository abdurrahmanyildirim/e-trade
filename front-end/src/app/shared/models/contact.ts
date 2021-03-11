export interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  desc: string;
  isRead?: boolean;
  sendDate?: Date;
}
