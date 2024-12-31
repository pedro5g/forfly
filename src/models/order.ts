import { and, count, desc, eq, gte, ilike, lte, sql, sum } from "drizzle-orm";
import { Base } from "./base";
import type {
  GetDailyReceiptInPeriodProps,
  GetDailyReceiptInPeriodReturn,
  GetDayOrdersAmountReturn,
  GetMonthCanceledOrdersAmountReturn,
  GetMonthOrdersAmountReturn,
  GetMothsReceiptsReturn,
  GetOrdersParams,
  GetOrdersResponse,
  GetOrderWithDetailsReturn,
  IOrders,
  OrderType,
} from "./repositories/i-orders-repository";
import dayjs from "dayjs";
import { orders, users } from "../db/schemas";

export class Order extends Base implements IOrders {
  async getOrderWithDetails(data: {
    orderId: string;
    restaurantId: string;
  }): Promise<GetOrderWithDetailsReturn | null> {
    const order = await this.db.query.orders.findFirst({
      columns: {
        id: true,
        status: true,
        totalInCents: true,
        createdAt: true,
      },
      with: {
        customer: {
          columns: {
            name: true,
            phone: true,
            email: true,
          },
        },
        orderItems: {
          columns: {
            id: true,
            priceInCents: true,
            quantity: true,
          },
          with: {
            product: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
      where(fields, { eq }) {
        return and(
          eq(fields.id, data.orderId),
          eq(fields.restaurantId, data.restaurantId)
        );
      },
    });

    return order ?? null;
  }

  async getMothsReceipts(
    restaurantId: string
  ): Promise<GetMothsReceiptsReturn> {
    const today = dayjs();
    const lastMonth = today.subtract(1, "month");
    const startOfLastMonth = lastMonth.startOf("month");

    const monthsReceipts = await this.db
      .select({
        monthWithYear: sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        receipt: sum(orders.totalInCents).mapWith(Number),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfLastMonth.toDate())
        )
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`);

    const currentMonthWithYear = today.format("YYYY-MM"); // year and month
    const lastMonthWithYear = lastMonth.format("YYYY-MM");

    const currentMonthReceipt = monthsReceipts.find((monthReceipt) => {
      return monthReceipt.monthWithYear === currentMonthWithYear;
    });
    const lastMonthReceipt = monthsReceipts.find((monthReceipt) => {
      return monthReceipt.monthWithYear === lastMonthWithYear;
    });

    const diffFromLastMonth =
      currentMonthReceipt && lastMonthReceipt
        ? (currentMonthReceipt.receipt * 100) / lastMonthReceipt.receipt
        : null;

    return {
      receipt: currentMonthReceipt?.receipt || 0,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    };
  }

  async getMonthOrdersAmount(
    restaurantId: string
  ): Promise<GetMonthOrdersAmountReturn> {
    const today = dayjs();
    const lastMonth = today.subtract(1, "month");
    const startOfLastMonth = lastMonth.startOf("month");

    const ordersPerMonth = await this.db
      .select({
        monthWithYear: sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        amount: count(),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfLastMonth.toDate())
        )
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`);

    const currentMonthWithYear = today.format("YYYY-MM"); // year and month
    const lastMonthWithYear = lastMonth.format("YYYY-MM");

    const currentMonthOrdersAmount = ordersPerMonth.find((orderPerMonth) => {
      return orderPerMonth.monthWithYear === currentMonthWithYear;
    });
    const lastMonthOrdersAmount = ordersPerMonth.find((orderPerMonth) => {
      return orderPerMonth.monthWithYear === lastMonthWithYear;
    });

    const diffFromLastMonth =
      currentMonthOrdersAmount && lastMonthOrdersAmount
        ? (currentMonthOrdersAmount.amount * 100) / lastMonthOrdersAmount.amount
        : null;

    return {
      amount: currentMonthOrdersAmount?.amount || 0,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    };
  }

  async getDayOrdersAmount(
    restaurantId: string
  ): Promise<GetDayOrdersAmountReturn> {
    const today = dayjs();
    const yesterday = today.subtract(1, "day");
    const startOfYesterday = yesterday.startOf("day");

    const orderPerDay = await this.db
      .select({
        dayWithMonthAndYear: sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
        amount: count(),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfYesterday.toDate())
        )
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`);

    const todayWithMonthAndYear = today.format("YYYY-MM-DD");
    const yesterdayWithMonthAndYear = yesterday.format("YYYY-MM-DD");

    const todayOrdersAmount = orderPerDay.find((order) => {
      return order.dayWithMonthAndYear === todayWithMonthAndYear;
    });
    const yesterdayOrderAmount = orderPerDay.find((order) => {
      return order.dayWithMonthAndYear === yesterdayWithMonthAndYear;
    });

    const diffFromYesterday =
      todayOrdersAmount && yesterdayOrderAmount
        ? (todayOrdersAmount.amount * 100) / yesterdayOrderAmount.amount
        : null;

    return {
      amount: todayOrdersAmount?.amount || 0,
      diffFromLastMonth: diffFromYesterday
        ? Number((diffFromYesterday - 100).toFixed(2))
        : 0,
    };
  }

  async getMonthCanceledOrdersAmount(
    restaurantId: string
  ): Promise<GetMonthCanceledOrdersAmountReturn> {
    const today = dayjs();
    const lastMonth = today.subtract(1, "month");
    const startOfLastMonth = lastMonth.startOf("month");

    const ordersPerMonth = await this.db
      .select({
        monthWithYear: sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        amount: count(),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          eq(orders.status, "canceled"),
          gte(orders.createdAt, startOfLastMonth.toDate())
        )
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`);

    const currentMonthWithYear = today.format("YYYY-MM");
    const lastMonthWithYear = lastMonth.format("YYYY-MM");

    const currentMonthOrdersAmount = ordersPerMonth.find((orderPerMonth) => {
      return orderPerMonth.monthWithYear === currentMonthWithYear;
    });

    const lastMonthOrdersAmount = ordersPerMonth.find((orderPerMonth) => {
      return orderPerMonth.monthWithYear === lastMonthWithYear;
    });

    const diffFromLastMonth =
      currentMonthOrdersAmount && lastMonthOrdersAmount
        ? (currentMonthOrdersAmount.amount * 100) / lastMonthOrdersAmount.amount
        : null;

    return {
      amount: currentMonthOrdersAmount?.amount || 0,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    };
  }

  async getDailyReceiptInPeriod(
    restaurantId: string,
    { from, to }: GetDailyReceiptInPeriodProps
  ): Promise<GetDailyReceiptInPeriodReturn[]> {
    const startDate = from ? dayjs(from) : dayjs().subtract(7, "days");
    const endDate = to ? dayjs(to) : from ? startDate.add(7, "days") : dayjs();

    if (endDate.diff(startDate, "days") > 7) {
      throw new Error("You cannot list receipt in a large period than 7 days.");
    }

    const receiptPerDay = await this.db
      .select({
        date: sql<string>`TO_CHAR(${orders.createdAt}, 'DD/MM')`,
        receipt: sum(orders.totalInCents).mapWith(Number),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(
            orders.createdAt,
            startDate
              .startOf("day")
              .add(startDate.utcOffset(), "minutes")
              .toDate()
          ),
          lte(
            orders.createdAt,
            endDate.endOf("day").add(startDate.utcOffset(), "minutes").toDate()
          )
        )
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt},'DD/MM')`);

    const orderedReceiptPerDay = receiptPerDay.sort((a, b) => {
      // a.data -> DD/MM .split('/') -> ['DD','MM'] -> map to covet string in a number
      const [dayA, monthA] = a.date.split("/").map(Number);
      const [dayB, monthB] = b.date.split("/").map(Number);

      if (monthA === monthB) {
        return dayA - dayB;
      } else {
        const dateA = new Date(2024, monthA - 1);
        const dateB = new Date(2024, monthB - 1);

        return dateA.getTime() - dateB.getTime();
      }
    });

    return orderedReceiptPerDay;
  }

  async getOrders(
    restaurantId: string,
    { orderId, customerName, status, pageIndex }: GetOrdersParams
  ): Promise<GetOrdersResponse> {
    const baseQuery = this.db
      .select({
        orderId: orders.id,
        createdAt: orders.createdAt,
        status: orders.status,
        total: orders.totalInCents,
        customerName: users.name,
      })
      .from(orders)
      .innerJoin(users, eq(users.id, orders.customerId))
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          orderId ? eq(orders.id, orderId) : undefined,
          status ? eq(orders.status, status) : undefined,
          customerName ? ilike(users.name, `%${customerName}%`) : undefined
        )
      );

    const [[amountOfOrdersQuery], allOrders] = await Promise.all([
      this.db.select({ count: count() }).from(baseQuery.as("baseQuery")),
      this.db
        .select()
        .from(baseQuery.as("baseQuery"))
        .offset((pageIndex - 1) * 10)
        .limit(10)
        .orderBy(({ status, createdAt }) => {
          return [
            sql`CASE ${status} 
            WHEN 'pending' THEN 1
            WHEN 'processing' THEN 2
            WHEN 'delivering' THEN 3
            WHEN 'delivered' THEN 4
            WHEN 'canceled' THEN 99 
            END`,
            desc(createdAt),
          ];
        }),
    ]);

    const amountOfOrders = amountOfOrdersQuery.count;

    return { orders: allOrders, totalCount: amountOfOrders };
  }

  async findByOrderIdAndRestaurantId(
    orderId: string,
    restaurantId: string
  ): Promise<OrderType | null> {
    const order = await this.db.query.orders.findFirst({
      where(fields, { eq, and }) {
        return and(
          eq(fields.id, orderId),
          eq(fields.restaurantId, restaurantId)
        );
      },
    });

    return order ?? null;
  }

  async approveOrder(orderId: string): Promise<void> {
    await this.db
      .update(orders)
      .set({ status: "processing" })
      .where(eq(orders.id, orderId));
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.db
      .update(orders)
      .set({ status: "canceled" })
      .where(eq(orders.id, orderId));
  }

  async dispatchOrder(orderId: string): Promise<void> {
    await this.db
      .update(orders)
      .set({ status: "delivering" })
      .where(eq(orders.id, orderId));
  }

  async deliverOrder(orderId: string): Promise<void> {
    await this.db
      .update(orders)
      .set({ status: "delivered" })
      .where(eq(orders.id, orderId));
  }
}
