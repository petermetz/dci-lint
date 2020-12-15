/* tslint:disable */
/* eslint-disable */
/**
 * DCI Lint Core API
 * Contains/describes the core API types for DCI Lint.
 *
 * The version of the OpenAPI document: 0.2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';

/**
 * 
 * @export
 * @interface LintGitRepoRequest
 */
export interface LintGitRepoRequest {
    /**
     * 
     * @type {string}
     * @memberof LintGitRepoRequest
     */
    cloneUrl: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof LintGitRepoRequest
     */
    targetPhrasePatterns: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof LintGitRepoRequest
     */
    includeFilePatterns?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof LintGitRepoRequest
     */
    excludeFilePatterns?: Array<string>;
}
/**
 * 
 * @export
 * @interface LintGitRepoResponse
 */
export interface LintGitRepoResponse {
    /**
     * 
     * @type {string}
     * @memberof LintGitRepoResponse
     */
    outcome: LintGitRepoResponseOutcomeEnum;
    /**
     * 
     * @type {Array<LinterError>}
     * @memberof LintGitRepoResponse
     */
    linterErrors: Array<LinterError>;
    /**
     * 
     * @type {string}
     * @memberof LintGitRepoResponse
     */
    cloneUrl: string;
}

/**
    * @export
    * @enum {string}
    */
export enum LintGitRepoResponseOutcomeEnum {
    SUCCESS = 'dci-lint.lint-git-repo-response.outcome.SUCCESS',
    INCONCLUSIVE = 'dci-lint.lint-git-repo-response.outcome.INCONCLUSIVE',
    FAILURE = 'dci-lint.lint-git-repo-response.outcome.FAILURE'
}

/**
 * 
 * @export
 * @interface LintGithubOrgRequest
 */
export interface LintGithubOrgRequest {
    /**
     * 
     * @type {string}
     * @memberof LintGithubOrgRequest
     */
    organizationName: string;
}
/**
 * 
 * @export
 * @interface LintGithubOrgResponse
 */
export interface LintGithubOrgResponse {
    /**
     * 
     * @type {string}
     * @memberof LintGithubOrgResponse
     */
    outcome: LintGithubOrgResponseOutcomeEnum;
    /**
     * 
     * @type {string}
     * @memberof LintGithubOrgResponse
     */
    organizationName: string;
}

/**
    * @export
    * @enum {string}
    */
export enum LintGithubOrgResponseOutcomeEnum {
    SUCCESS = 'dci-lint.lint-github-org-response.outcome.SUCCESS',
    INCONCLUSIVE = 'dci-lint.lint-github-org-response.outcome.INCONCLUSIVE',
    FAILURE = 'dci-lint.lint-github-org-response.outcome.FAILURE'
}

/**
 * 
 * @export
 * @interface LinterError
 */
export interface LinterError {
    /**
     * 
     * @type {string}
     * @memberof LinterError
     */
    file: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof LinterError
     */
    targetPhrasePatterns: Array<string>;
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Lints a Git repository
         * @param {LintGitRepoRequest} [lintGitRepoRequest] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        lintGitRepoV1: async (lintGitRepoRequest?: LintGitRepoRequest, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/lint-git-repo`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof lintGitRepoRequest !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(lintGitRepoRequest !== undefined ? lintGitRepoRequest : {}) : (lintGitRepoRequest || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Lints a Github organization
         * @param {LintGithubOrgRequest} [lintGithubOrgRequest] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        lintGithubOrgV1: async (lintGithubOrgRequest?: LintGithubOrgRequest, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/lint-github-org`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof lintGithubOrgRequest !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(lintGithubOrgRequest !== undefined ? lintGithubOrgRequest : {}) : (lintGithubOrgRequest || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Lints a Git repository
         * @param {LintGitRepoRequest} [lintGitRepoRequest] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async lintGitRepoV1(lintGitRepoRequest?: LintGitRepoRequest, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<LintGitRepoResponse>> {
            const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).lintGitRepoV1(lintGitRepoRequest, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Lints a Github organization
         * @param {LintGithubOrgRequest} [lintGithubOrgRequest] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async lintGithubOrgV1(lintGithubOrgRequest?: LintGithubOrgRequest, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<LintGithubOrgResponse>> {
            const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).lintGithubOrgV1(lintGithubOrgRequest, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Lints a Git repository
         * @param {LintGitRepoRequest} [lintGitRepoRequest] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        lintGitRepoV1(lintGitRepoRequest?: LintGitRepoRequest, options?: any): AxiosPromise<LintGitRepoResponse> {
            return DefaultApiFp(configuration).lintGitRepoV1(lintGitRepoRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Lints a Github organization
         * @param {LintGithubOrgRequest} [lintGithubOrgRequest] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        lintGithubOrgV1(lintGithubOrgRequest?: LintGithubOrgRequest, options?: any): AxiosPromise<LintGithubOrgResponse> {
            return DefaultApiFp(configuration).lintGithubOrgV1(lintGithubOrgRequest, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @summary Lints a Git repository
     * @param {LintGitRepoRequest} [lintGitRepoRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public lintGitRepoV1(lintGitRepoRequest?: LintGitRepoRequest, options?: any) {
        return DefaultApiFp(this.configuration).lintGitRepoV1(lintGitRepoRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Lints a Github organization
     * @param {LintGithubOrgRequest} [lintGithubOrgRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public lintGithubOrgV1(lintGithubOrgRequest?: LintGithubOrgRequest, options?: any) {
        return DefaultApiFp(this.configuration).lintGithubOrgV1(lintGithubOrgRequest, options).then((request) => request(this.axios, this.basePath));
    }
}


