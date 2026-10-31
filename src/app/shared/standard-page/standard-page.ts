import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { IconsService } from "../icons/icons.service.js";
import { SESSION_SERVICE } from "../oauth/conditional-inject";
import { Theme, ThemeingService } from "../themeing";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
    selector: "app-standard-page",
    imports: [RouterLink, MatCardModule, MatToolbarModule, MatButtonModule, MatButtonToggleModule, MatIconModule, MatTooltip],
    templateUrl: "./standard-page.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: "./standard-page.scss",
})
export class StandardPage {
    protected readonly themeingService = inject(ThemeingService);
    protected readonly sessionService = inject(SESSION_SERVICE);
    protected readonly iconsService = inject(IconsService);

    readonly authInNewTab = input(true);

    protected chooseTheme(theme: Theme) {
        this.themeingService.setUserPersistedTheme(theme);
    }
}
