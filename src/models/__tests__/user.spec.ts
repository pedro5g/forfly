import { eq } from "drizzle-orm";
import { db } from "../../db/connection";
import { users } from "../../db/schemas";
import { Context } from "../context";
import { User } from "../user";

const userIds: string[] = [];
describe("User unit tests", () => {
  test("[User] initialize", () => {
    const ctx = new Context();
    const user = new User(ctx);

    assert(user);
  });

  afterEach(async () => {
    while (userIds.length) {
      const userId = userIds.pop();
      if (userId) {
        await db.delete(users).where(eq(users.id, userId));
      }
    }
  });

  beforeEach(async () => {
    const [manager] = await db
      .insert(users)
      .values({
        name: "jhon",
        email: "testuser3@gmail.com",
        phone: "15 997766 3300",
        role: "manager",
      })
      .returning({ id: users.id });
    userIds.push(manager.id);
  });

  test("Find by email", async () => {
    const ctx = new Context();
    const user = new User(ctx);

    const fundUser = await user.findByEmail("testuser3@gmail.com");
    expect(fundUser).toBeTruthy();
    expect(fundUser).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "jhon",
        email: "testuser3@gmail.com",
        phone: "15 997766 3300",
        role: "manager",
      })
    );
  });
  test("Find by id", async () => {
    const ctx = new Context();
    const user = new User(ctx);

    const fundUser = await user.findById(userIds[0]);
    expect(fundUser).toBeTruthy();
    expect(fundUser).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "jhon",
        email: "testuser3@gmail.com",
        phone: "15 997766 3300",
        role: "manager",
      })
    );
  });
});
