import { object, string } from "joi";
import { OpenAPIV3 } from "openapi-types";
import { LintGitRepoV1Endpoint } from "./lint-git-repo/lint-git-repo-endpoint-v1-constants";
import { LintGithubOrgV1Endpoint } from "./lint-github-org/lint-github-org-endpoint-v1-constants";

export const OPEN_API_JSON: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "DCI Lint Core API",
    description: "Contains/describes the core API types for DCI Lint.",
    version: "0.2.0",
  },
  servers: [],
  components: {
    schemas: {
      GlobPattern: {
        type: "string",
        minLength: 1,
        maxLength: 255,
        nullable: false,
        example: "**/*.txt",
      },
      LinterError: {
        type: "object",
        required: ["file", "targetPhrasePatterns"],
        properties: {
          file: {
            type: "string",
            minLength: 1,
            maxLength: 255,
            nullable: false,
          },
          targetPhrasePatterns: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
      LintGithubOrgRequest: {
        required: ["organizationName"],
        properties: {
          organizationName: {
            type: "string",
            minLength: 1,
            maxLength: 1024,
            nullable: false,
          },
        },
      },
      LintGithubOrgResponse: {
        required: ["organizationName", "outcome"],
        properties: {
          outcome: {
            type: "string",
            enum: [
              "dci-lint.lint-github-org-response.outcome.SUCCESS",
              "dci-lint.lint-github-org-response.outcome.INCONCLUSIVE",
              "dci-lint.lint-github-org-response.outcome.FAILURE",
            ],
          },
          organizationName: {
            type: "string",
            minLength: 1,
            maxLength: 1024,
            nullable: false,
          },
        },
      },
      LintGitRepoRequest: {
        required: ["cloneUrl", "targetPhrasePatterns"],
        properties: {
          cloneUrl: {
            type: "string",
            minLength: 5,
            maxLength: 1024,
            nullable: false,
          },
          targetPhrasePatterns: {
            type: "array",
            items: {
              type: "string",
            },
          },
          includeFilePatterns: {
            type: "array",
            nullable: false,
            minItems: 1,
            maxItems: 100,
            items: {
              $ref: "#/components/schemas/GlobPattern",
              nullable: false,
            },
          },
          excludeFilePatterns: {
            type: "array",
            nullable: false,
            minItems: 1,
            maxItems: 100,
            items: {
              $ref: "#/components/schemas/GlobPattern",
              nullable: false,
            },
          },
        },
      },
      LintGitRepoResponse: {
        required: ["cloneUrl", "outcome", "linterErrors"],
        properties: {
          outcome: {
            type: "string",
            enum: [
              "dci-lint.lint-git-repo-response.outcome.SUCCESS",
              "dci-lint.lint-git-repo-response.outcome.INCONCLUSIVE",
              "dci-lint.lint-git-repo-response.outcome.FAILURE",
            ],
          },
          linterErrors: {
            type: "array",
            items: {
              $ref: "#/components/schemas/LinterError",
            },
          },
          cloneUrl: {
            type: "string",
            minLength: 1,
            maxLength: 1024,
            nullable: false,
          },
        },
      },
    },
  },
  paths: {
    [LintGithubOrgV1Endpoint.HTTP_PATH]: {
      [LintGithubOrgV1Endpoint.HTTP_VERB_LOWER_CASE]: {
        operationId: LintGithubOrgV1Endpoint.OPENAPI_OPERATION_ID,
        summary: "Lints a Github organization",
        description: "",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LintGithubOrgRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LintGithubOrgResponse",
                },
              },
            },
          },
        },
      },
    },
    [LintGitRepoV1Endpoint.HTTP_PATH]: {
      [LintGitRepoV1Endpoint.HTTP_VERB_LOWER_CASE]: {
        operationId: LintGitRepoV1Endpoint.OPENAPI_OPERATION_ID,
        summary: "Lints a Git repository",
        description: "",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LintGitRepoRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LintGitRepoResponse",
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
  const fnTag = "OpenApiSpec#exportToFileSystemAsJson()";
  const fs = await import("fs");
  const path = await import("path");
  const filename = `openapi-spec.json`;
  const defaultDest = path.join(__dirname, "../json/generated/", filename);
  const destination = process.argv[2] || defaultDest;

  // tslint:disable-next-line: no-console
  console.log(`${fnTag} destination=${destination}`);

  fs.writeFileSync(destination, JSON.stringify(OPEN_API_JSON, null, 4));
}

if (require.main === module) {
  exportToFileSystemAsJson();
}
