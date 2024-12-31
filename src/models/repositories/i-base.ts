import type { db } from "../../db/connection";
import type { Context } from "../context";

export interface IBase {
  db: typeof db;
  context: Context;
}
