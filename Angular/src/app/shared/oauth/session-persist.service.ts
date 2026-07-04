import { Injectable, signal } from "@angular/core";
import { OAuthCredentials, OAuthSession } from "@gouvernathor/m3api-oauth2";

@Injectable({
    providedIn: "root",
})
export class SessionPersistService {
    private static readonly selfRestrictedCredentials = new OAuthCredentials(
        "7fbac585c1bfcd02898ca7ce3e8041b0",
        "8850f9c90952fbfd854a3b442b9ceb78c15b82da",
    );
    private static readonly localCredentials = new OAuthCredentials(
        "3169b028c9dab61c11f925ab307a6aec",
        "5a7d8c3c505b31387eace86631937e42e225f975",
    );

    private readonly apiUrl = "commons.wikimedia.org"; // not sure, maybe meta.wikimedia.org to auth first
    private readonly storageKey = "oauth-session";

    private readonly credentials = SessionPersistService.localCredentials;
    private session: OAuthSession = this.loadFromStorage();

    getSession = signal(this.session, { equal: () => false });

    refreshFromStorage() {
        this.session.deserialize(this.getSerializationFromStorage());
        this.getSession.update(s => s);
    }

    private loadFromStorage() {
        const serialization = this.getSerializationFromStorage();
        return new OAuthSession(this.apiUrl, {
            crossorigin: true,
        }, {
            userAgent: "ParliamentDiagram-Angular",
            "m3api-oauth2/credentials": this.credentials,
        }, serialization);
    }

    private getSerializationFromStorage() {
        const json: string|null|undefined = globalThis.localStorage?.getItem(this.storageKey) ?? globalThis.sessionStorage?.getItem(this.storageKey);
        if (json) {
            return JSON.parse(json);
        }
        return {};
    }

    saveSession(useLocalStorage: boolean) {
        if (this.session) {
            const serialization = this.session.serialize();
            const storage = useLocalStorage ?
                globalThis.localStorage :
                globalThis.sessionStorage;
            storage?.setItem(this.storageKey, JSON.stringify(serialization));
        }
    }
}
