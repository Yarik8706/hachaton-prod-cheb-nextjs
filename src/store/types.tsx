export interface IProductCardData {
  id: string;
  title: string;
  image: string;
  cost: number;
  partner: IPartner;
  time_delivery: string;
  category: ICategory;
}

export interface IProfile {
  id: string;
  username: string;
  address: string;
}

export interface IPartner {
  id: string;
  name: string;
}

export interface ICategory {
  id: string;
  name: string;
}

export interface ICartInput {
  id: string;
  items: IProductCardData[];
}

export interface ICartAddInput {
  item_id: string;
  goods_id: string;
}

export interface IOrder {
  id: string;
  is_active: boolean;
  items: IProductCardData[];
}

export interface ICreateOrderInput {
  cart_id: string;
}

export interface IOrderId {
  order_id: string;
}

// {
//   "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "name": "string",
//   "cost": 0,
//   "partner": {
//   "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     "name": "string"
// },
//   "time_delivery": "2025-10-18T09:03:46.570Z",
//   "category": {
//   "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     "name": "string"
// }
// }