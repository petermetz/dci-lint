import * as OpenAPI from "express-openapi-validator/dist/framework/types";

export const OPEN_API_JSON: OpenAPI.OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "DCI LInt API",
    description: "Interact with a DCI Lint backend deployment through HTTP.",
    version: "0.0.1",
  },
  servers: [],
  components: {
    schemas: {
      MemoryUsage: {
        type: "object",
        properties: {
          rss: {
            title: "Resident Set Size",
            type: "number",
          },
          heapTotal: {
            title: "V8 memory usage - heap total",
            type: "number",
          },
          heapUsed: {
            title: "V8 memory usage - heap used",
            type: "number",
          },
          external: {
            title:
              "Memory usage of C++ objects bound to JavaScript objects managed by V8",
            type: "number",
          },
          arrayBuffers: {
            title:
              "Memory allocated for ArrayBuffers and SharedArrayBuffers, including all Node.js Buffers",
            type: "number",
          },
        },
      },
      HealthCheckResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          createdAt: {
            type: "string",
          },
          memoryUsage: {
            $ref: "#/components/schemas/MemoryUsage",
          },
        },
        required: ["createdAt", "memoryUsage"],
      },
    },
  },
  paths: {
    "/api/v1/api-server/healthcheck": {
      get: {
        summary: "Can be used to verify liveness of an API server instance",
        description:
          "Returns the current timestamp of the API server as proof of health/liveness",
        parameters: [],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthCheckResponse",
                },
              },
            },
          },
        },
      },
    },
  },
};

export async function exportToFileSystemAsJson(): Promise<void> {
  const fs = await import("fs");
  const destination = process.argv[2] || "./openapi-spec.json";

  // tslint:disable-next-line: no-console
  console.log(
    `OpenApiSpec#exportToFileSystemAsJson() destination=${destination}`
  );
  fs.writeFileSync(destination, JSON.stringify(OPEN_API_JSON, null, 4));
}
