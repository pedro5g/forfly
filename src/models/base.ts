import { db } from "../db/connection";
import type { Context } from "./context";
import type { IBase } from "./repositories/i-base";

export class Base implements IBase {
  db: typeof db;
  context: Context;

  constructor(context: Context) {
    this.db = db;
    this.context = context;
  }
}
