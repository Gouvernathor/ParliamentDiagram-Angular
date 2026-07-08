import { inject, InjectionToken } from "@angular/core";
import type { SessionService } from "./session.service";
import { environment } from "../../../environments/environment";

const sessionServiceClass = environment.credentials ?
    (await import("./session.service")).SessionService :
    null;

export const SESSION_SERVICE = new InjectionToken<SessionService|null>("session service", {
    factory: () => sessionServiceClass ?
        inject(sessionServiceClass) :
        null,
});
