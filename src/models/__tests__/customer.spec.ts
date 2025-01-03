import { eq } from "drizzle-orm";
import { db } from "../../db/connection";
import { users } from "../../db/schemas";
import { Context } from "../context";
import { Customer } from "../customer";

const userIds: string[] = [];

describe("Customer unite test", async () => {
  afterEach(async () => {
    while (userIds.length) {
      const userId = userIds.pop();
      if (userId) {
        await db.delete(users).where(eq(users.id, userId));
      }
    }
  });
  test("[Customer] initialize", () => {
    const ctx = new Context();
    const customer = new Customer(ctx);

    assert(customer);
  });

  test("insert new customer", async () => {
    const ctx = new Context();
    const customer = new Customer(ctx);
    const data = {
      name: "Jon doe",
      email: "customer@gmail.com",
      phone: "+55 15 00000 0000",
    };

    const res = await customer.registerCustomer(data);
    userIds.push(res.id);
    expect(res.id).toBeTruthy();

    const managerOnDb = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, res.id);
      },
    });

    expect(managerOnDb).toBeTruthy();
    expect(managerOnDb).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: "customer",
      })
    );
  });
});
