import type Session from "m3api";

export interface UploadParameters {
    filename: string;
    ignorewarnings: boolean;
    file: null; // TODO
}

export class CompletedSession {
    constructor(
        private readonly session: Session
    ) {}

    async upload(options: Readonly<Partial<UploadParameters>> = {}) {
        const token = await this.getCSRFToken();

        const uploadResponseBody = await this.doUpload(token, options);
        const result = uploadResponseBody.upload?.result;
        return uploadResponseBody;
    }

    private async getCSRFToken() {
        return await this.session.request({
            action: "query",
            meta: "tokens",
            format: "json",
        }, {}).query.tokens.csrftoken;
    }

    private async doUpload(token: string, {
        filename = "MyDiagram.svg",
        ignorewarnings = false,
        file = null, // TODO
    }: Readonly<Partial<UploadParameters>>) {
        return await this.session.request({
            action: "upload",

            filename,
            // comment,
            // tags,
            // text,
            ignorewarnings, // TODO should not be present if false
            file,
            token,
        }, {
            method: "POST",
            tokenType: "csrf",
        });
    }
}
