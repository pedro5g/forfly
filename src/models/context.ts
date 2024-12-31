import { Manager } from "./manager";
import { Order } from "./order";
import { Product } from "./product";
import type { IManagerRepository } from "./repositories/i-managers-repository";
import type { IOrders } from "./repositories/i-orders-repository";
import type { IProducts } from "./repositories/i-products-repository";
import type { IRestaurantsRepository } from "./repositories/i-restaurants-repository";
import { Restaurant } from "./restaurant";

export class Context {
  manager: IManagerRepository;
  restaurants: IRestaurantsRepository;
  orders: IOrders;
  products: IProducts;

  constructor() {
    this.manager = new Manager(this);
    this.restaurants = new Restaurant(this);
    this.orders = new Order(this);
    this.products = new Product(this);
  }
}
