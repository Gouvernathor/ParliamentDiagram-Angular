import { DOCUMENT, inject, Injectable, signal } from "@angular/core";

const THEMES = [ "light", "dark" ] as const;
export type Theme = typeof THEMES[number];
const isATheme: (t: any) => t is Theme = ((t: any) => THEMES.includes(t)) as any;

@Injectable({
    providedIn: "root",
})
export class ThemeingService {
    private readonly document = inject(DOCUMENT);

    private readonly cachedPersistedTheme = signal(this.directGetUserPersistedTheme());

    private directGetUserPersistedTheme(): Theme|null {
        const saved = globalThis.localStorage?.getItem("theme");
        if (isATheme(saved)) {
            return saved;
        }
        return null;
    }

    getUserPersistedTheme(): Theme|null {
        return this.cachedPersistedTheme();
    }

    setUserPersistedTheme(theme: Theme|null) {
        this.cachedPersistedTheme.set(theme);
        this.applyThemeOnPage(theme);
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
