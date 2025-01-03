import { AuthLink } from "./auth-link";
import { Customer } from "./customer";
import { Manager } from "./manager";
import { Order } from "./order";
import { Product } from "./product";
import type { ICustomersRepository } from "./repositories/i-customers-repository";
import type { IManagerRepository } from "./repositories/i-managers-repository";
import type { IOrders } from "./repositories/i-orders-repository";
import type { IProducts } from "./repositories/i-products-repository";
import type { IRestaurantsRepository } from "./repositories/i-restaurants-repository";
import type { IUserRepository } from "./repositories/i-users-repository";
import { Restaurant } from "./restaurant";
import { User } from "./user";

export class Context {
  manager: IManagerRepository;
  customer: ICustomersRepository;
  user: IUserRepository;
  restaurants: IRestaurantsRepository;
  authLinks: AuthLink;
  orders: IOrders;
  products: IProducts;

  constructor() {
    this.manager = new Manager(this);
    this.customer = new Customer(this);
    this.user = new User(this);
    this.restaurants = new Restaurant(this);
    this.authLinks = new AuthLink(this);
    this.orders = new Order(this);
    this.products = new Product(this);
  }
}
