export interface EnvironmentVariables {
    readonly credentials: {
        readonly name: string;
        readonly clientId: string;
        readonly clientSecret: string;
    } | null;
}
