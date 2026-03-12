import { SetMetadata } from "@nestjs/common";
import { AUTH_PUBLIC_KEY } from "../constants/app.constants";

export const Public = (): MethodDecorator & ClassDecorator =>
  SetMetadata(AUTH_PUBLIC_KEY, true);
