import { Express } from "express";
import safeStringify from "fast-safe-stringify";
import { IWebServiceEndpoint } from "@dci-lint/core-api";
import { RuntimeError } from "run-time-error";

/**
 * Hooks up an endpoint instance to an ExpressJS web app object.
 *
 * @param webApp The ExpressJS application object that `endpoint` will be registered with.
 * @param endpoint The `IWebServiceEndpoint` instance that will be registered.
 */
export function registerWebServiceEndpoint(
  webApp: Express,
  endpoint: IWebServiceEndpoint
): void {
  const fnTag = "registerWebServiceEndpoint";
  const httpVerb = endpoint.getVerbLowerCase();
  const httpPath = endpoint.getPath();
  const requestHandler = endpoint.getExpressRequestHandler();

  const registrationMethod = (webApp as any)[httpVerb].bind(webApp);
  try {
    registrationMethod(httpPath, requestHandler);
  } catch (ex: unknown) {
    if (ex instanceof Error) {
      throw new Error(
        `${fnTag} Express verb method ${httpVerb} threw ` +
          ` while registering endpoint: ${ex.stack}`
      );
    } else {
      throw new RuntimeError(
        `${fnTag} Express verb method ${httpVerb} threw ` +
          ` while registering endpoint:`,
        safeStringify(ex)
      );
    }
  }
}
