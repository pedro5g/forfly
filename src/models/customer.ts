import { users } from "../db/schemas";
import type {
  ICustomersRepository,
  RegisterCustomerParams,
} from "./repositories/i-customers-repository";
import { User } from "./user";

export class Customer extends User implements ICustomersRepository {
  async registerCustomer({
    name,
    email,
    phone,
  }: RegisterCustomerParams): Promise<{ id: string }> {
    const [customer] = await this.db
      .insert(users)
      .values({
        name,
        email,
        phone,
        role: "customer",
      })
      .returning({ id: users.id });

    return customer;
  }
}
