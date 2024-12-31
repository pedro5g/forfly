import { eq } from "drizzle-orm";
import { db } from "../../db/connection";
import { users } from "../../db/schemas";
import { Context } from "../context";
import { Manager } from "../manager";

const userIds: string[] = [];

describe("Manager unite test", async () => {
  afterEach(async () => {
    while (userIds.length) {
      const userId = userIds.pop();
      if (userId) {
        await db.delete(users).where(eq(users.id, userId));
      }
    }
  });
  test("[Manager] initialize", () => {
    const ctx = new Context();
    const manager = new Manager(ctx);

    assert(manager);
  });

  test("insert new manager", async () => {
    const ctx = new Context();
    const manager = new Manager(ctx);
    const data = {
      managerName: "Jon doe",
      email: "test@gmail.com",
      phone: "+55 15 00000 0000",
    };

    const res = await manager.insert(data);
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
        name: data.managerName,
        email: data.email,
        phone: data.phone,
        role: "manager",
      })
    );
  });

  test("find by email", async () => {
    const ctx = new Context();
    const manager = new Manager(ctx);
    const data = {
      managerName: "Jon doe",
      email: "test@gmail.com",
      phone: "+55 15 00000 0000",
    };

    const res = await manager.insert(data);
    userIds.push(res.id);

    const fundManger = await manager.findByEmail(data.email);
    expect(fundManger).toBeTruthy();
    expect(fundManger).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: data.managerName,
        email: data.email,
        phone: data.phone,
        role: "manager",
      })
    );
  });
  test("find by id", async () => {
    const ctx = new Context();
    const manager = new Manager(ctx);
    const data = {
      managerName: "Jon doe",
      email: "test@gmail.com",
      phone: "+55 15 00000 0000",
    };

    const res = await manager.insert(data);
    userIds.push(res.id);

    const fundManger = await manager.findById(res.id);
    expect(fundManger).toBeTruthy();
    expect(fundManger).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: data.managerName,
        email: data.email,
        phone: data.phone,
        role: "manager",
      })
    );
  });
});
