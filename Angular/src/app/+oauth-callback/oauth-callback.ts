import { Component, inject, input, OnInit, signal } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { StandardPage } from "../shared/standard-page/standard-page";
import { SESSION_SERVICE } from "../shared/oauth/conditional-inject";

export const oAuthCallbackPageCodeResolver: ResolveFn<string|null> = route =>
    route.queryParamMap.get("code");

@Component({
    imports: [StandardPage, MatButtonModule],
    templateUrl: "./oauth-callback.html",
    styleUrl: "./oauth-callback.scss",
})
export class OauthCallbackPage implements OnInit {
    protected readonly sessionService = inject(SESSION_SERVICE);

    /** To be resolved by the router from the query params */
    readonly code = input.required<string|null>();

    protected readonly done = signal(false);
    protected readonly error = signal<any>(null);

    async ngOnInit() {
        if (this.sessionService) {
            const code = this.code();
            if (code) {
                try {
                    await this.sessionService.complete(code);
                    this.done.set(true);
                } catch (e) {
                    this.error.set(e);
                }
            }
        }
    }
}
