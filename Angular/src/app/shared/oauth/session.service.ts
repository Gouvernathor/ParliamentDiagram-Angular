import { Injectable } from "@angular/core";
import { OAuthCredentials, OAuthSession } from "@gouvernathor/m3api-oauth2";
import { CompletedSession } from "./upload";

@Injectable({
    providedIn: "root",
})
export class SessionService {
    static readonly selfRestrictedCredentials = new OAuthCredentials(
        "7fbac585c1bfcd02898ca7ce3e8041b0",
        "8850f9c90952fbfd854a3b442b9ceb78c15b82da",
    );
    static readonly localCredentials = new OAuthCredentials(
        "3169b028c9dab61c11f925ab307a6aec",
        "5a7d8c3c505b31387eace86631937e42e225f975",
    );

    private readonly apiUrl = "commons.wikimedia.org"; // not sure, maybe meta.wikimedia.org to auth first
    private readonly storageKey = "oauth-session";

    private credentials = SessionService.localCredentials;
    private session: InitedSession|CompletedSession|null = null;

    private loadSession(credentials: OAuthCredentials) {
        const serializationJson = globalThis.localStorage?.getItem(this.storageKey) ?? globalThis.sessionStorage?.getItem(this.storageKey);
        const serialization = serializationJson ? JSON.parse(serializationJson) : {};

        const session = new OAuthSession(this.apiUrl, {
            crossorigin: true,
        }, {
            "m3api-oauth2/credentials": credentials,
        }, serialization);

        return session;
    }

    private saveSession(session: OAuthSession, useLocalStorage: boolean) {
        const serialization = session.serialize();
        const storage = useLocalStorage ?
            globalThis.localStorage :
            globalThis.sessionStorage;
        storage?.setItem(this.storageKey, JSON.stringify(serialization));
    }

    private async init(session: OAuthSession): Promise<InitedSession|CompletedSession> {
        if (session.isComplete) {
            return new CompletedSession(session);
        } else {
            const url: string = await session.getAuthorizeURL();
            this.saveSession(session, false);
            return {
                session,
                authorizationUrl: url,
            };
        }
    }

    private loadAndInit(credentials: OAuthCredentials) {
        this.credentials = credentials;
        return this.init(this.loadSession(credentials));
    }

    async getSession(credentials = this.credentials) {
        if (credentials === this.credentials && this.session) {
            return this.session;
        }
        return this.loadAndInit(credentials);
    }

    async refresh() {
        return this.loadAndInit(this.credentials);
    }

    async isAuthenticated() {
        return (await this.getSession()) instanceof CompletedSession;
    }

    async complete(code: string, useLocalStorage = false) {
        const session = (await this.getSession()).session;
        await session.complete(code);
        this.saveSession(session, useLocalStorage);
    }
}

/**
 * When you have this, the next step is to make the user click on the authorizationUrl.
 * It is also obtainable
 */
export interface InitedSession {
    session: OAuthSession;
    authorizationUrl?: string;
}
