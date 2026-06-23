import { Injectable } from "@angular/core";
import Session from "m3api";
import {
    OAuthClient, deserializeOAuthSession, serializeOAuthSession,
    completeOAuthSession, initOAuthSession, isCompleteOAuthSession,
// @ts-expect-error
} from "m3api-oauth2";
import { CompletedSession } from "./upload";

interface Credentials {
    key: string;
    secret?: string;
}

@Injectable({
    providedIn: "root",
})
export class SessionService {
    private readonly apiUrl = "commons.wikimedia.org"; // not sure, maybe meta.wikimedia.org to auth first
    private readonly storageKey = "oauth-session";

    readonly selfRestrictedCredentials: Credentials = {
        key: "7fbac585c1bfcd02898ca7ce3e8041b0",
        secret: "8850f9c90952fbfd854a3b442b9ceb78c15b82da",
    };
    readonly localCredentials: Credentials = {
        key: "3169b028c9dab61c11f925ab307a6aec",
        secret: "5a7d8c3c505b31387eace86631937e42e225f975",
    };

    private loadSession(credentials = this.selfRestrictedCredentials) {
        const session = new Session(this.apiUrl, {
            crossorigin: true,
        }, {
            // @ts-expect-error
            "m3api-oauth2/client": new OAuthClient(
                credentials.key,
                credentials.secret,
            ),
        });

        const serialization = globalThis.localStorage?.getItem(this.storageKey) ?? globalThis.sessionStorage?.getItem(this.storageKey);
        if (serialization) {
            deserializeOAuthSession(session, JSON.parse(serialization));
        }

        return session;
    }

    private saveSession(session: Session, useLocalStorage: boolean) {
        const serialization = serializeOAuthSession(session);
        const storage = useLocalStorage ?
            globalThis.localStorage :
            globalThis.sessionStorage;
        storage?.setItem(this.storageKey, JSON.stringify(serialization));
    }

    private async init(session: Session): Promise<InitedSession|CompletedSession> {
        if (isCompleteOAuthSession(session)) {
            return new CompletedSession(session);
        } else {
            const url: string = await initOAuthSession(session);
            this.saveSession(session, false);
            return {
                session,
                authorizationUrl: url,
            };
        }
    }

    loadAndInit(credentials: Credentials) {
        return this.init(this.loadSession(credentials));
    }

    /**
     * To be called in/by the oauth callback route/age
     * @param href the payload is the "code" query param, the rest of the url is ignored
     */
    async complete(session: Session, href: string, useLocalStorage = false) {
        await completeOAuthSession(session, href);
        this.saveSession(session, useLocalStorage);
    }
}

/**
 * When you have this, the next step is to make the user click on the authorizationUrl.
 * Not sure the session is useful to anything at that point.
 */
export interface InitedSession {
    // session: Session;
    authorizationUrl: string;
}
