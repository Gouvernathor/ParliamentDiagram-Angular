import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { callbackUrlParameterName } from "@gouvernathor/m3api-oauth2";
import { SESSION_SERVICE } from "../shared/oauth/conditional-inject";
import { StandardPage } from "../shared/standard-page/standard-page";
import { Resolvers } from "../shared/utils/types";

@Component({
    imports: [StandardPage, MatButtonModule],
    templateUrl: "./oauth-callback.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: "./oauth-callback.scss",
})
export class OauthCallbackPage implements OnInit {
    protected readonly sessionService = inject(SESSION_SERVICE);

    /** To be resolved by the router from the query params */
    readonly code = input.required<string|null>();

    static readonly resolve: Resolvers<OauthCallbackPage> = {
        code: route => route.queryParamMap.get(callbackUrlParameterName),
    };

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
