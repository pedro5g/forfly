import { z } from "zod";
import { authMiddleware } from "../../core/middleware/auth-middleware";
import type { FastifyTypeInstance } from "../../types/fastify";

const $Status = z.enum([
  "pending",
  "processing",
  "delivering",
  "delivered",
  "canceled",
]);

export async function orderRoutes(app: FastifyTypeInstance) {
  app.get(
    "/orders",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Orders"],
        description: "Get and list orders with or without filters",
        querystring: z.object({
          customerName: z.string().optional(),
          orderId: z.string().optional(),
          status: $Status.optional(),
          pageIndex: z.coerce
            .number()
            .refine((page) => {
              if (page <= 0) return 1;
              return page;
            })
            .optional()
            .default(1),
        }),
        response: {
          200: z.object({
            orders: z.array(
              z.object({
                status: $Status,
                orderId: z.string(),
                customerName: z.string(),
                total: z.number(),
                createdAt: z.date(),
              })
            ),
            meta: z.object({
              pageIndex: z.number(),
              perPage: z.number(),
              totalCount: z.number(),
            }),
          }),
          401: z.object({}).describe("Unauthorized"),
        },
      },
    },
    async (request, reply) => {
      const { customerName, orderId, status, pageIndex } = request.query;
      const { restaurantId } = await request.getCurrentUser();

      if (!restaurantId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const data = await request.ctx.orders.getOrders(restaurantId, {
        customerName,
        orderId,
        status,
        pageIndex,
      });

      reply.status(200).send({
        orders: data.orders,
        meta: {
          pageIndex,
          perPage: 10,
          totalCount: data.totalCount,
        },
      });
    }
  );

  app.get(
    "/orders/:orderId",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Orders"],
        description: "Get order details",
        params: z.object({ orderId: z.string() }),
        response: {
          400: z
            .object({ message: z.string().default("Order not found") })
            .describe("Order not found"),
          401: z
            .object({ message: z.string().default("Unauthorized") })
            .describe("Unauthorized"),
          200: z.object({
            id: z.string(),
            status: $Status,
            totalInCents: z.number(),
            createdAt: z.date(),
            customer: z
              .object({
                name: z.string(),
                phone: z.string().nullable(),
                email: z.string().email(),
              })
              .nullable(),
            orderItems: z.array(
              z.object({
                id: z.string(),
                priceInCents: z.number(),
                quantity: z.number(),
                product: z
                  .object({
                    name: z.string(),
                  })
                  .nullable(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { orderId } = request.params;
      const { restaurantId } = await request.getCurrentUser();

      if (!restaurantId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const order = await request.ctx.orders.getOrderWithDetails({
        restaurantId,
        orderId,
      });

      if (!order) {
        return reply.status(400).send({ message: "Order not found" });
      }

      reply.status(200).send(order);
    }
  );

  app.get(
    "/metrics/month-receipt",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Orders"],
        description: "get month receipt metrics",
        response: {
          401: z
            .object({ message: z.string().default("Unauthorized") })
            .describe("Unauthorized"),
          200: z.object({
            receipt: z.number(),
            diffFromLastMonth: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = await request.getCurrentUser();

      if (!restaurantId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const { receipt, diffFromLastMonth } =
        await request.ctx.orders.getMothsReceipts(restaurantId);

      reply.status(200).send({
        receipt,
        diffFromLastMonth,
      });
    }
  );
  app.get(
    "/metrics/month-orders-amount",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Orders"],
        description: "get month orders amount metrics",
        response: {
          401: z
            .object({ message: z.string().default("Unauthorized") })
            .describe("Unauthorized"),
          200: z.object({
            amount: z.number(),
            diffFromLastMonth: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = await request.getCurrentUser();

      if (!restaurantId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const { amount, diffFromLastMonth } =
        await request.ctx.orders.getMonthOrdersAmount(restaurantId);

      reply.status(200).send({
        amount,
        diffFromLastMonth,
      });
    }
  );

  app.get(
    "/metrics/month-canceled-orders-amount",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Orders"],
        description: "get month canceled orders amount metrics",
        response: {
          401: z
            .object({ message: z.string().default("Unauthorized") })
            .describe("Unauthorized"),
          200: z.object({
            amount: z.number(),
            diffFromLastMonth: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = await request.getCurrentUser();

      if (!restaurantId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const { amount, diffFromLastMonth } =
        await request.ctx.orders.getMonthCanceledOrdersAmount(restaurantId);

      reply.status(200).send({
        amount,
        diffFromLastMonth,
      });
    }
  );
  app.get(
    "/metrics/day-orders-amount",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Orders"],
        description: "get day orders amount metrics",
        response: {
          401: z
            .object({ message: z.string().default("Unauthorized") })
            .describe("Unauthorized"),
          200: z.object({
            amount: z.number(),
            diffFromLastMonth: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = await request.getCurrentUser();

      if (!restaurantId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const { amount, diffFromLastMonth } =
        await request.ctx.orders.getDayOrdersAmount(restaurantId);

      reply.status(200).send({
        amount,
        diffFromLastMonth,
      });
    }
  );
  app.get(
    "/metrics/daily-receipt-in-period",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Orders"],
        description: "Get daily receipt in period metrics",
        querystring: z.object({
          from: z.string().optional(),
          to: z.string().optional(),
        }),
        response: {
          401: z
            .object({ message: z.string().default("Unauthorized") })
            .describe("Unauthorized"),
          200: z.array(
            z.object({
              date: z.string(),
              receipt: z.number(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = await request.getCurrentUser();

      if (!restaurantId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const { from, to } = request.query;

      const orderedReceiptPerDay =
        await request.ctx.orders.getDailyReceiptInPeriod(restaurantId, {
          from,
          to,
        });

      reply.status(200).send(orderedReceiptPerDay);
    }
  );

  app.patch(
    "/orders/:orderId/approve",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Orders"],
        description: "Approve order",
        params: z.object({ orderId: z.string().uuid() }),
        response: {
          204: z.null().describe("order approved"),
          400: z
            .object({
              message: z.enum([
                "Order not found",
                "You can only approve pending orders",
              ]),
            })
            .describe("Order not found"),
          401: z
            .object({ message: z.string().default("Unauthorized") })
            .describe("Unauthorized"),
        },
      },
    },
    async (request, reply) => {
      const { orderId } = request.params;
      const { restaurantId } = await request.getCurrentUser();

      if (!restaurantId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const order = await request.ctx.orders.findByOrderIdAndRestaurantId(
        orderId,
        restaurantId
      );

      if (!order) {
        return reply.status(400).send({ message: "Order not found" });
      }

      if (order.status !== "pending") {
        return reply
          .status(400)
          .send({ message: "You can only approve pending orders" });
      }

      await request.ctx.orders.approveOrder(orderId);
      reply.status(204).send();
    }
  );
  app.patch(
    "/orders/:orderId/dispatch",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Orders"],
        description: "Dispatch order",
        params: z.object({ orderId: z.string().uuid() }),
        response: {
          204: z.null().describe("order dispatched"),
          400: z
            .object({
              message: z.enum([
                "Order not found",
                'You cannot dispatch orders that are not in "processing" status',
              ]),
            })
            .describe("Order not found"),
          401: z
            .object({ message: z.string().default("Unauthorized") })
            .describe("Unauthorized"),
        },
      },
    },
    async (request, reply) => {
      const { orderId } = request.params;
      const { restaurantId } = await request.getCurrentUser();

      if (!restaurantId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const order = await request.ctx.orders.findByOrderIdAndRestaurantId(
        orderId,
        restaurantId
      );

      if (!order) {
        return reply.status(400).send({ message: "Order not found" });
      }

      if (order.status !== "processing") {
        return reply.status(400).send({
          message:
            'You cannot dispatch orders that are not in "processing" status',
        });
      }

      await request.ctx.orders.dispatchOrder(orderId);
      reply.status(204).send();
    }
  );
  app.patch(
    "/orders/:orderId/deliver",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Orders"],
        description: "Deliver order",
        params: z.object({ orderId: z.string().uuid() }),
        response: {
          204: z.null().describe("order deliver"),
          400: z.object({
            message: z.enum([
              'You cannot deliver orders that are not in "delivering" status',
              "Order not found",
            ]),
          }),
          401: z
            .object({ message: z.string().default("Unauthorized") })
            .describe("Unauthorized"),
        },
      },
    },
    async (request, reply) => {
      const { orderId } = request.params;
      const { restaurantId } = await request.getCurrentUser();

      if (!restaurantId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const order = await request.ctx.orders.findByOrderIdAndRestaurantId(
        orderId,
        restaurantId
      );

      if (!order) {
        return reply.status(400).send({ message: "Order not found" });
      }

      if (order.status !== "delivering") {
        return reply.status(400).send({
          message:
            'You cannot deliver orders that are not in "delivering" status',
        });
      }

      await request.ctx.orders.deliverOrder(orderId);
      reply.status(204).send();
    }
  );
  app.patch(
    "/orders/:orderId/cancel",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Orders"],
        description: "Cancel order",
        params: z.object({ orderId: z.string().uuid() }),
        response: {
          204: z.null().describe("order canceled"),
          400: z.object({
            message: z.enum([
              "You cannot cancel orders after dispatch",
              "Order not found",
            ]),
          }),
          401: z
            .object({ message: z.string().default("Unauthorized") })
            .describe("Unauthorized"),
        },
      },
    },
    async (request, reply) => {
      const { orderId } = request.params;
      const { restaurantId } = await request.getCurrentUser();

      if (!restaurantId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const order = await request.ctx.orders.findByOrderIdAndRestaurantId(
        orderId,
        restaurantId
      );

      if (!order) {
        return reply.status(400).send({ message: "Order not found" });
      }

      if (!["pending", "processing"].includes(order.status)) {
        return reply
          .status(400)
          .send({ message: "You cannot cancel orders after dispatch" });
      }

      await request.ctx.orders.cancelOrder(orderId);
      reply.status(204).send();
    }
  );
}
