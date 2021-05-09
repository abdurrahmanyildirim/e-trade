export enum RequestMethod {
  post = 'post',
  get = 'get',
  delete = 'delete'
}

export enum RequestType {
  category = 'category',
  product = 'product',
  user = 'user',
  order = 'order',
  contact = 'contact',
  auth = 'auth',
  photo = 'photo',
  cart = 'cart'
}

export interface RequestOptions {
  method?: string;
  params?: object;
  body?: any;
  serviceMethod: string;
}
