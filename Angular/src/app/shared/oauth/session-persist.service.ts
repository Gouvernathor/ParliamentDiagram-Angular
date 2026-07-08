import { Injectable, Signal, signal } from "@angular/core";
import { OAuthCredentials, OAuthSession } from "@gouvernathor/m3api-oauth2";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: "root",
})
export class SessionPersistService {
    private readonly apiUrl = "commons.wikimedia.org";
    private readonly storageKey = "oauth-session";

    private readonly credentials = new OAuthCredentials(
        environment.credentials!.clientId,
        environment.credentials!.clientSecret,
    );
    private readonly session: OAuthSession = this.loadFromStorage();
    private readonly sessionSignal = signal(this.session, { equal: () => false });

    readonly getSession = this.sessionSignal.asReadonly();

    constructor() {
        globalThis.addEventListener?.("storage", ev => {
            if (ev.key === this.storageKey) {
                this.refreshFromStorage();
            }
        });
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

    private refreshFromStorage() {
        this.session.deserialize(this.getSerializationFromStorage());
        this.sessionSignal.update(s => s);
    }

    resetIncomplete() {
        this.session.resetIncomplete();
        this.sessionSignal.update(s => s);
    }

    private getSerializationFromStorage() {
        const json: string|null|undefined = globalThis.localStorage?.getItem(this.storageKey);
        if (json) {
            return JSON.parse(json);
        }
        return {};
    }

    saveSession() {
        if (this.session) {
            const serialization = this.session.serialize();
            globalThis.localStorage?.setItem(this.storageKey, JSON.stringify(serialization));
        }
    }
}
