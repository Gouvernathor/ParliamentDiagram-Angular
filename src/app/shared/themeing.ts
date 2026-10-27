import { DOCUMENT, inject, Injectable, signal } from "@angular/core";

const THEMES = [ "light", "dark" ] as const;
export type Theme = typeof THEMES[number] | null;
function isATheme(t: any): t is Theme {
    return THEMES.includes(t);
}

@Injectable({
    providedIn: "root",
})
export class ThemeingService {
    private readonly document = inject(DOCUMENT);

    private readonly cachedPersistedTheme = signal(this.directGetUserPersistedTheme());

    private directGetUserPersistedTheme(): Theme {
        const saved = globalThis.localStorage?.getItem("theme");
        if (isATheme(saved)) {
            return saved;
        }
        return null;
    }

    getUserPersistedTheme(): Theme {
        return this.cachedPersistedTheme();
    }

    setUserPersistedTheme(theme: Theme) {
        this.cachedPersistedTheme.set(theme);
        this.applyThemeOnPage(theme);
        if (theme) {
            globalThis.localStorage?.setItem("theme", theme);
        } else {
            globalThis.localStorage?.removeItem("theme");
        }
    }

    applyThemeOnPage(theme: Theme) {
        const body = this.document.body;
        body.classList.remove(...THEMES.map(t => `${t}-mode`));
        if (theme != null) {
            body.classList.add(`${theme}-mode`);
        }
    }
}
