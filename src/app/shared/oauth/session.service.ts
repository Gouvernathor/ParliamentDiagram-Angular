import { inject, Injectable, resource } from "@angular/core";
import { SessionPersistService } from "./session-persist.service";

export interface UploadParameters {
    filename: string;
    file: Blob;
    description: string;
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
     */
    async complete(code: string) {
        await this.session.complete(code);
    }

    logOut() {
        this.persistService.reset();
    }

    /**
     * Upload a file to Wikimedia commons
     * May throw a m3api ApiError in case of an error result
     */
    async upload(options: Readonly<UploadParameters>) {
        const uploadResponseBody = await this.doUpload(await this.getCSRFToken(), options);
        // const result = uploadResponseBody["upload"]?.result;
        console.log(uploadResponseBody.upload.result);
        console.log(uploadResponseBody);
        return uploadResponseBody;
    }

    private async getCSRFToken() {
        const resp = await this.session.request<{"query": {"tokens": {"csrftoken": string}}}>({
            action: "query",
            meta: "tokens",
            format: "json",
        });
        return resp.query.tokens.csrftoken;
    }

    private async doUpload(token: string, {
        filename,
        file,
        description,
        ignorewarnings = false,
    }: Readonly<UploadParameters>) {
        const ignorewarningsObject: { ignorewarnings?: any } = {};
        if (ignorewarnings) {
            ignorewarningsObject.ignorewarnings = true;
        }

        return await this.session.request<UploadResult>({
            action: "upload",

            filename,
            comment: "Direct upload from the ParliamentDiagram tool",
            // tags,
            text: description,
            ...ignorewarningsObject,
            file,
            token,
        }, {
            method: "POST",
            tokenType: "csrf",
        });
    }
}

type UploadResult = UploadSuccessResult|UploadWarningResult;

interface UploadSuccessResult {
    upload: {
        filename: string;
        result: "Success";
        imageinfo: {
            url: string;
            // …
        };
    };
}

interface UploadWarningResult {
    upload: {
        result: "Warning";
        warnings: {
        //     exists: string;
        //     "was-deleted": string;
        //     duplicate: string;
        //     "duplicate-archive": string;
        //     badfilename: string;
        // } & {
            [k in string]?: string;
        };
        filekey?: string;
        sessionkey?: string;
    };
}
