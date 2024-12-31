import type { users } from "../../db/schemas";
import type { IBase } from "./i-base";

export type ManagerType = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "manager" | "customer";
  createdAt: Date;
  updatedAt: Date;
};

export type RegisterManager = {
  managerName: string;
  email: string;
  phone: string;
};

export interface IManagerRepository extends IBase {
  insert(data: RegisterManager): Promise<{ id: string }>;
  findById(id: string): Promise<ManagerType | null>;
  findByEmail(email: string): Promise<ManagerType | null>;
}
