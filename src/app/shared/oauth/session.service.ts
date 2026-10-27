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

    readonly userInfo = resource({
        params: () => this.session, // so that it reloads when the session changes
        loader: () => this.getUserInfo(),
    }).asReadonly();

    /**
     * Request user basic infos (such as the username)
     * A cheap request that tests the credentials validity and erases them if obsolete
     */
    private async getUserInfo() {
        if (this.isLoggedIn()) {
            const uir = await this.session.request<UserInfoResult>({
                action: "query",
                meta: "userinfo",
            });
            return uir.query.userinfo;
        }
        return null;
    }

    /**
     * Upload a file to Wikimedia commons
     * May throw a m3api ApiError in case of an error result
     */
    async upload(options: Readonly<UploadParameters>) {
        const uploadResponseBody = await this.doUpload(await this.getCSRFToken(), options);
        // const result = uploadResponseBody["upload"]?.result;
        // TODO handle the result
        console.log(uploadResponseBody.upload.result);
        console.log(uploadResponseBody);
        return uploadResponseBody;
    }

    private async getCSRFToken() {
        const resp = await this.session.request<TokenResult>({
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
        const params: Parameters<typeof this.session.request>[0] = {
            action: "upload",

            filename,
            comment: "Direct upload from the ParliamentDiagram tool",
            // tags,
            text: description,
            file,
            token,
        };
        if (ignorewarnings) {
            params["ignorewarnings"] = true;
        }
        return await this.session.request<UploadResult>(params, {
            method: "POST",
            tokenType: "csrf",
        });
    }
}

interface UserInfoResult {
    batchcomplete: "";
    query: {
        userinfo: {
            id: number;
            name: string;
        };
    };
}

interface TokenResult {
    query: {
        tokens: {
            csrftoken: string;
        };
    };
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
