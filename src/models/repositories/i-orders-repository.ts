import type { IBase } from "./i-base";

export type Status =
  | "pending"
  | "processing"
  | "delivering"
  | "delivered"
  | "canceled";

export type OrderType = {
  status: Status;
  id: string;
  createdAt: Date;
  customerId: string | null;
  restaurantId: string;
  totalInCents: number;
};

export type GetOrdersParams = {
  customerName?: string;
  orderId?: string;
  status?: Status;
  pageIndex: number;
};

export type GetOrdersResponse = {
  orders: {
    createdAt: Date;
    status: Status;
    orderId: string;
    customerName: string;
    total: number;
  }[];
  totalCount: number;
};

type GetOrderWithDetailsProps = {
  orderId: string;
  restaurantId: string;
};

export type GetDailyReceiptInPeriodProps = {
  from?: string;
  to?: string;
};
export type GetDailyReceiptInPeriodReturn = {
  date: string;
  receipt: number;
};

export type GetMothsReceiptsReturn = {
  receipt: number;
  diffFromLastMonth: number;
};

export type GetMonthOrdersAmountReturn = {
  amount: number;
  diffFromLastMonth: number;
};

export type GetDayOrdersAmountReturn = {
  amount: number;
  diffFromLastMonth: number;
};

export type GetMonthCanceledOrdersAmountReturn = {
  amount: number;
  diffFromLastMonth: number;
};

export type GetOrderWithDetailsReturn = {
  id: string;
  status: Status;
  totalInCents: number;
  createdAt: Date;
  customer: {
    name: string;
    phone: string | null;
    email: string;
  } | null;
  orderItems: {
    id: string;
    priceInCents: number;
    quantity: number;
    product: {
      name: string;
    } | null;
  }[];
};

export type ProductItem = {
  productId: string;
  quantity: number;
};

export type CreateOrderParams = {
  customerId: string;
  restaurantId: string;
  items: ProductItem[];
};

export interface IOrders extends IBase {
  createOrder(data: CreateOrderParams): Promise<{ id: string }>;
  getOrders(
    restaurantId: string,
    query: GetOrdersParams
  ): Promise<GetOrdersResponse>;
  getDailyReceiptInPeriod(
    restaurantId: string,
    query: GetDailyReceiptInPeriodProps
  ): Promise<GetDailyReceiptInPeriodReturn[]>;
  getOrderWithDetails(
    data: GetOrderWithDetailsProps
  ): Promise<GetOrderWithDetailsReturn | null>;
  getMothsReceipts(restaurantId: string): Promise<GetMothsReceiptsReturn>;
  getMonthOrdersAmount(
    restaurantId: string
  ): Promise<GetMonthOrdersAmountReturn>;
  getDayOrdersAmount(restaurantId: string): Promise<GetDayOrdersAmountReturn>;
  getMonthCanceledOrdersAmount(
    restaurantId: string
  ): Promise<GetMonthCanceledOrdersAmountReturn>;
  findByOrderIdAndRestaurantId(
    orderId: string,
    restaurantId: string
  ): Promise<OrderType | null>;
  dispatchOrder(orderId: string): Promise<void>;
  deliverOrder(orderId: string): Promise<void>;
  cancelOrder(orderId: string): Promise<void>;
  approveOrder(orderId: string): Promise<void>;
}
