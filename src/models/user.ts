import { Base } from "./base";
import type {
  IUserRepository,
  UserType,
} from "./repositories/i-users-repository";

export class User extends Base implements IUserRepository {
  async findByEmail(email: string): Promise<UserType | null> {
    const user = await this.db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email);
      },
    });

    return user || null;
  }
}
