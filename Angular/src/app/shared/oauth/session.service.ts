import { inject, Injectable, resource } from "@angular/core";
import { SessionPersistService } from "./session-persist.service";

export interface UploadParameters {
    filename: string;
    file: Blob;
    ignorewarnings?: boolean;
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

    /**
     * If not logged in, provide this link to the user.
     */
    readonly authorizationURL = resource({
        params: () => this.session,
        loader: ({params: session}) => session.getAuthorizeURL(),
    }).asReadonly();

    /**
     * To be called from the oauth callback page
     * @param useLocalStorage whether to save the authorization in a more durable storage,
     * or to forget it when closing the window
     */
    async complete(code: string) {
        try {
            await this.session.complete(code);
        } catch (e) {
            this.persistService.resetIncomplete();
        }
        this.persistService.saveSession();
    }

    /**
     * Upload a file to Wikimedia commons
     */
    async upload(options: Readonly<UploadParameters>) {
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
        filename,
        file,
        ignorewarnings = false,
    }: Readonly<UploadParameters>) {
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
