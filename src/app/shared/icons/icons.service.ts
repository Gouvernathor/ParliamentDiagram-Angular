import { inject, Service } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

import lightModeAuto from "./light_mode_auto.svg";
import lightMode from "./light_mode.svg";
import darkMode from "./dark_mode.svg";

const icons = [
    ["light_mode_auto", lightModeAuto],
    ["light_mode", lightMode],
    ["dark_mode", darkMode],
] as const;
export type IconName = typeof icons[number][0];

@Service()
export class IconsService {
    private readonly iconRegistry = inject(MatIconRegistry);
    private readonly sanitizer = inject(DomSanitizer);

    public readonly iconNames = Object.fromEntries(icons.map(([iconName, iconContent]) => {
        this.iconRegistry.addSvgIconLiteral(iconName, this.sanitizer.bypassSecurityTrustHtml(iconContent));
        return [ iconName, iconName ];
    })) as Record<IconName, IconName>;
}
