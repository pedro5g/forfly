import "fastify";
import type { jwtPayloadSchema } from "../http/server";
import type { Context } from "../models/context";

export type PayloadType = {
  sub: string;
  restauranteId?: string | undefined;
};

declare module "fastify" {
  export interface FastifyRequest {
    signUser: (payload: PayloadType, redirectURL: string) => Promise<void>;
    signOut: () => void;
    getCurrentUser: () => Promise<{
      userId: PayloadType["sub"];
      restaurantId: PayloadType["restauranteId"];
    }>;
    ctx: Context;
  }
}
