import { inject, InjectionToken } from "@angular/core";
import { environment } from "../../../environments/environment";

const SessionService = environment.credentials ?
    (await import("./session.service")).SessionService :
    null;

export const SESSION_SERVICE = new InjectionToken("session service", {
    factory: () => SessionService ?
        inject(SessionService) :
        null,
});
