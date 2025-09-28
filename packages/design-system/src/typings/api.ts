export type ServerResponseError = string | null;

export interface AuthErrors {
  email?: string | null;
  password?: string | null;
  general?: string | null;
}
