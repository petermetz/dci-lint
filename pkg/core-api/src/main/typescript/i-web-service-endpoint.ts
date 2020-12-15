import { Express } from "express";
import { IExpressRequestHandler } from "./i-express-request-handler";

/**
 * Implementers of this interface are responsible for providing an API endpoint
 * that can be dynamically registered at runtime through the methods defined
 * on this interface.
 */
export interface IWebServiceEndpoint {
  /**
   * Hooks up this endpoint instance into an ExpressJS web application object.
   * Internally this method uses the other methods of the `IWebServiceEndpoint`
   * instnce to obtain the verb, path and handler which are the necessary
   * input for being able to create any HTTP request handler in ExpressJS.
   */
  registerExpress(expressApp: Express): IWebServiceEndpoint;
  /**
   * Returns the lower case HTTP verb name that this endpoint is designed to
   * operate on.
   * Example return values: "post", "get", "put", "delete", etc.
   */
  getVerbLowerCase(): string;
  /**
   * Returns the HTTP path that this endpoint is designed to be served under.
   */
  getPath(): string;
  /**
   * Returns the function that can be directly passed in to any request
   * handler registration methods of ExpressJS.
   *
   * > Handler registration methods are usually: `.get()`, `.post()`, `.all()`, `.use()`, etc.
   */
  getExpressRequestHandler(): IExpressRequestHandler;
}
