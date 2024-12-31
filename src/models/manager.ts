import { users } from "../db/schemas";
import { Base } from "./base";
import type {
  IManagerRepository,
  ManagerType,
  RegisterManager,
} from "./repositories/i-managers-repository";

export class Manager extends Base implements IManagerRepository {
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

  async findById(id: string): Promise<ManagerType | null> {
    const user = await this.db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, id);
      },
    });

    return user ?? null;
  }

  async findByEmail(email: string): Promise<ManagerType | null> {
    const user = await this.db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email);
      },
    });

    return user ?? null;
  }
}
