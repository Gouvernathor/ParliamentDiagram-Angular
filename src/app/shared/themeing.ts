import { DOCUMENT, inject, Injectable } from "@angular/core";
import { CanActivateFn } from "@angular/router";

type Theme = "light"|"dark";

@Injectable({
    providedIn: "root",
})
export class ThemeingService {
    private readonly document = inject(DOCUMENT);

    getUserPersistedTheme(): Theme|null {
        return null; // TODO
    }

    setUserPersistedTheme(theme: Theme|null) {
        // TODO
    }

    applyThemeOnPage(theme: Theme|null) {
        const body = this.document.body;
        body.classList.remove("light-mode", "dark-mode");
        if (theme != null) {
            body.classList.add(`${theme}-mode`);
        }
    }
}

/**
 * Not really a guard.
 * This sets the `<html>` lang attribute to the current language.
 */
export const themeGuard: CanActivateFn = () => {
    const service = inject(ThemeingService);
    service.applyThemeOnPage(service.getUserPersistedTheme());

    return true;
};
