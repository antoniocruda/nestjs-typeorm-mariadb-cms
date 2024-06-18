/* eslint @typescript-eslint/no-explicit-any: "off" */

export type ResponseStatus = 'success' | 'failed';

export interface AwsUser {
    id: string;
    username: string;
    scope: string;
}

export interface ListResponse<T> {
    list: T[];
    total: number;
}

export interface IResponse<T> {
    code: number;
    info: T;
}

export class ErrorCode {
    public static readonly OK = 0;
    public static readonly FAILED = 1;
    public static readonly VALIDATION_ERROR = 1001;
    public static readonly NOT_FOUND = 1002;
    public static readonly ALREADY_EXISTS = 1003;
    public static readonly AUTHENTICATION_ERROR = 1004;
    public static readonly AUTHORIZATION_ERROR = 1005;
    public static readonly FILE_TOO_LARGE = 1006;
    public static readonly ACCOUNT_LOCKED = 1007;
    public static readonly ACCOUNT_INACTIVE = 1008;
    public static readonly INVALID_OR_EXPIRED_REFRESH_SESSION = 1009;
};