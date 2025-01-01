import type { IBase } from "./i-base";
import type { IUserRepository } from "./i-users-repository";

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
  phone?: string;
};

export interface IManagerRepository extends IBase, IUserRepository {
  insert(data: RegisterManager): Promise<{ id: string }>;
  findById(id: string): Promise<ManagerType | null>;
}
