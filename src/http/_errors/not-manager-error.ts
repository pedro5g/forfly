export class NotManagerError extends Error {
  constructor() {
    super("User is not a restaurant manager.");
    this.name = "NotManagerError";
  }
}
