import { AxiosError } from "axios";

export function isAxiosError(it: unknown): it is AxiosError {
  if (typeof it !== "object") {
    return false;
  }
  const axiosError = it as AxiosError;
  if (typeof axiosError.config !== "object") {
    return false;
  }
  if (typeof axiosError.isAxiosError !== "function") {
    return false;
  }
  if (typeof axiosError.toJSON !== "function") {
    return false;
  }
  return true;
}
