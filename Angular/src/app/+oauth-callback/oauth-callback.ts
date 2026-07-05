import { Component, inject, input, OnInit } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { StandardPage } from "../shared/standard-page/standard-page";
import { SessionService } from "../shared/oauth/session.service";
import { MatButtonModule } from "@angular/material/button";

export const oAuthCallbackPageCodeResolver: ResolveFn<string|null> = route =>
    route.queryParamMap.get("code");

@Component({
    imports: [StandardPage, MatButtonModule],
    templateUrl: "./oauth-callback.html",
    styleUrl: "./oauth-callback.scss",
})
export class OauthCallbackPage implements OnInit {
    private readonly sessionService = inject(SessionService);

    /** To be resolved by the router from the query params */
    readonly code = input.required<string|null>();

    protected done = false;

    async ngOnInit() {
        const code = this.code();
        if (code) {
            await this.sessionService.complete(code);
            this.done = true;
        }
    }
}
