// refresh service param types & return types
import type { UserOutput } from "./base/index.js";

export interface RefreshSessionInput {
  refreshToken: string;
}

export interface RefreshSessionOutput extends UserOutput {}
