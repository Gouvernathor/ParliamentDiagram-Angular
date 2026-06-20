import { DOCUMENT, inject, Injectable } from "@angular/core";
import { CanActivateFn } from "@angular/router";

const THEMES = [ "light", "dark" ] as const;
export type Theme = typeof THEMES[number];
const isATheme: (t: any) => t is Theme = ((t: any) => THEMES.includes(t)) as any;

@Injectable({
    providedIn: "root",
})
export class ThemeingService {
    private readonly document = inject(DOCUMENT);

    getUserPersistedTheme(): Theme|null {
        const saved = globalThis.localStorage?.getItem("theme");
        if (isATheme(saved)) {
            return saved;
        }
        return null;
    }

    setUserPersistedTheme(theme: Theme|null) {
        if (theme) {
            globalThis.localStorage?.setItem("theme", theme);
        } else {
            globalThis.localStorage?.removeItem("theme");
        }
    }

    applyThemeOnPage(theme: Theme|null) {
        const body = this.document.body;
        body.classList.remove(...THEMES.map(t => `${t}-mode`));
        if (theme != null) {
            body.classList.add(`${theme}-mode`);
        }
    }
}

/**
 * Not really a guard.
 * This sets the `<html>` theme class to the persisted language.
 */
export const themeGuard: CanActivateFn = () => {
    const service = inject(ThemeingService);
    service.applyThemeOnPage(service.getUserPersistedTheme());

    return true;
};
