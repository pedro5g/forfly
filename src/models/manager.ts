import { users } from "../db/schemas";
import type {
  IManagerRepository,
  ManagerType,
  RegisterManager,
} from "./repositories/i-managers-repository";
import { User } from "./user";

export class Manager extends User implements IManagerRepository {
  async insert(data: RegisterManager): Promise<{ id: string }> {
    const [manager] = await this.db
      .insert(users)
      .values({
        name: data.managerName,
        email: data.email,
        phone: data.phone,
        role: "manager",
      })
      .returning({ id: users.id });

    return manager;
  }
}
