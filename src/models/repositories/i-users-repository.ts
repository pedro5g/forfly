import type { IBase } from "./i-base";

export type RoleType = "manager" | "customer";

export type UserType = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: RoleType;
  createdAt: Date;
  updatedAt: Date;
};

export interface IUserRepository extends IBase {
  findByEmail(email: string): Promise<UserType | null>;
}
