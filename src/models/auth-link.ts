import { eq } from "drizzle-orm";
import { authLinks } from "../db/schemas";
import { Base } from "./base";
import type {
  AuthLinkType,
  IAuthLinksRepository,
  InsertData,
} from "./repositories/i-auth-links-repository";

export class AuthLink extends Base implements IAuthLinksRepository {
  async insert(data: InsertData): Promise<void> {
    await this.db.insert(authLinks).values(data);
  }
  async delete(code: string): Promise<void> {
    await this.db.delete(authLinks).where(eq(authLinks.code, code));
  }
  async findByCode(code: string): Promise<AuthLinkType | null> {
    const authLink = await this.db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code);
      },
    });

    return authLink ?? null;
  }
}
