import { Injectable } from "@angular/core";
import Session from "m3api";
// @ts-expect-error
import { OAuthClient, deserializeOAuthSession, serializeOAuthSession } from "m3api-oauth2";

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

    loadSession(credentials = this.selfRestrictedCredentials) {
        const session = new Session(this.apiUrl, {
            crossorigin: true,
        }, {
            // @ts-expect-error
            "m3api-oauth2/client": new OAuthClient(
                credentials.key,
                credentials.secret,
            ),
        });

        const serialization = globalThis.sessionStorage?.getItem(this.storageKey);
        if (serialization) {
            deserializeOAuthSession(session, JSON.parse(serialization));
        }

        return session;
    }

    saveSession(session: Session) {
        const serialization = serializeOAuthSession(session);
        globalThis.sessionStorage?.setItem(this.storageKey, JSON.stringify(serialization));
    }
}
