import { eq } from "drizzle-orm";
import { db } from "../../db/connection";
import { authLinks, users } from "../../db/schemas";
import { AuthLink } from "../auth-link";
import { Context } from "../context";
import { randomUUID } from "node:crypto";

const userIds: string[] = [];
const authLinkIds: string[] = [];

describe("AuthLink unite tests", () => {
  afterEach(async () => {
    while (userIds.length) {
      const userId = userIds.pop();
      if (userId) {
        await db.delete(users).where(eq(users.id, userId));
      }
    }
    while (authLinkIds.length) {
      const authLinkId = authLinkIds.pop();
      if (authLinkId) {
        await db.delete(authLinks).where(eq(authLinks.id, authLinkId));
      }
    }
  });

  beforeEach(async () => {
    const [manager] = await db
      .insert(users)
      .values({
        name: "jhon",
        email: "testcode@gmail.com",
        phone: "15 997766 3300",
        role: "manager",
      })
      .returning({ id: users.id });
    userIds.push(manager.id);
  });
  test("[AuthLink] initialize", () => {
    const ctx = new Context();
    const authLink = new AuthLink(ctx);

    assert(authLink);
  });

  test("insert new auth link", async () => {
    const ctx = new Context();
    const authLink = new AuthLink(ctx);

    const code = randomUUID();

    await authLink.insert({ code, userId: userIds[0] });

    const authLinkOnDatabase = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code);
      },
    });

    expect(authLinkOnDatabase).toBeTruthy();
    expect(authLinkOnDatabase).toEqual(
      expect.objectContaining({
        code: code,
        id: expect.any(String),
        createdAt: expect.any(Date),
        userId: userIds[0],
      })
    );
  });
  test("find by code", async () => {
    const ctx = new Context();
    const authLink = new AuthLink(ctx);

    const code = randomUUID();
    await authLink.insert({ code, userId: userIds[0] });

    const fundAuthLink = await authLink.findByCode(code);

    expect(fundAuthLink).toBeTruthy();
    expect(fundAuthLink).toEqual(
      expect.objectContaining({
        code: code,
        id: expect.any(String),
        createdAt: expect.any(Date),
        userId: userIds[0],
      })
    );
  });
  test("delete auth link", async () => {
    const ctx = new Context();
    const authLink = new AuthLink(ctx);

    const code = randomUUID();
    await authLink.insert({ code, userId: userIds[0] });
    await authLink.delete(code);
    const fundAuthLink = await authLink.findByCode(code);

    expect(fundAuthLink).toBeNull();
  });
});
