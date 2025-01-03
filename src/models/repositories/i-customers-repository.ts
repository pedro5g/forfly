import type { IBase } from "./i-base";
import type { IUserRepository } from "./i-users-repository";

export type RegisterCustomerParams = {
  name: string;
  email: string;
  phone?: string;
};

export interface ICustomersRepository extends IBase, IUserRepository {
  registerCustomer(data: RegisterCustomerParams): Promise<{ id: string }>;
}
