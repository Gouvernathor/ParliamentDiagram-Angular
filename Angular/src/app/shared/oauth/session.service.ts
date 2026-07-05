import { inject, Injectable, signal } from "@angular/core";
import { SessionPersistService } from "./session-persist.service";

export interface UploadParameters {
    filename: string;
    ignorewarnings: boolean;
    file: null; // TODO
}

@Injectable({
    providedIn: "root",
})
export class SessionService {
    private readonly persistService = inject(SessionPersistService);

    private get session() {
        return this.persistService.getSession();
    }

    isLoggedIn() {
        return this.session.isComplete;
    }

    private authorizationURL = signal<string|null>(null);

    /**
     * If not logged in, provide this link to the user.
     */
    getAuthorizationURL() {
        const cached = this.authorizationURL();
        if (!cached) {
            this.updateAuthorizationURL();
        }
        return cached;
    }

    /**
     * To be called from the oauth callback page
     * @param useLocalStorage whether to save the authorization in a more durable storage,
     * or to forget it when closing the window
     */
    async complete(code: string) {
        await this.session.complete(code);
        this.persistService.saveSession();
    }

    /**
     * Use this if the user reached the oauth callback and completed in in another tab
     */
    refreshFromStorage() {
        this.persistService.refreshFromStorage();
        this.authorizationURL() || this.updateAuthorizationURL();
    }

    private async updateAuthorizationURL() {
        const url = await this.session.getAuthorizeURL();
        this.persistService.saveSession();
        this.authorizationURL.set(url);
    }

    /**
     * Upload a file to Wikimedia commons
     */
    async upload(options: Partial<Readonly<UploadParameters>> = {}) {
        const uploadResponseBody = await this.doUpload(await this.getCSRFToken(), options);
        // const result = uploadResponseBody["upload"]?.result;
        return uploadResponseBody;
    }

    private async getCSRFToken() {
        const resp: any = await this.session.request({
            action: "query",
            meta: "tokens",
            format: "json",
        });
        return resp.query.tokens.csrftoken;
    }

    private async doUpload(token: string, {
        filename = "MyDiagram.svg",
        ignorewarnings = false,
        file = null, // TODO
    }: Readonly<Partial<UploadParameters>> = {}) {
        const ignorewarningsObject: { ignorewarnings?: any } = {};
        if (ignorewarnings) {
            ignorewarningsObject.ignorewarnings = true;
        }

        return await this.session.request({
            action: "upload",

            filename,
            // comment,
            // tags,
            // text,
            ...ignorewarningsObject,
            file,
            token,
        }, {
            method: "POST",
            tokenType: "csrf",
        });
    }
}
