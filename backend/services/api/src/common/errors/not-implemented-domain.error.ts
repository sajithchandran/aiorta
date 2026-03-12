import { AppError } from "./app-error";

export class NotImplementedDomainError extends AppError {
  constructor(feature: string) {
    super("NOT_IMPLEMENTED", `${feature} is not implemented yet.`);
  }
}
