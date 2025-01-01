import type { IBase } from "./i-base";

export type InsertData = {
  userId: string;
  code: string;
};

export type AuthLinkType = {
  id: string;
  code: string;
  userId: string;
  createdAt: Date | null;
};

export interface IAuthLinksRepository extends IBase {
  insert(data: InsertData): Promise<void>;
  findByCode(code: string): Promise<AuthLinkType | null>;
  delete(code: string): Promise<void>;
}
