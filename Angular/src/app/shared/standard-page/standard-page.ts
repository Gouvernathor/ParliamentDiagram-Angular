import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SessionService } from '../oauth/session.service';
import { Theme, ThemeingService } from '../themeing';

@Component({
    selector: 'app-standard-page',
    imports: [RouterLink, MatCardModule, MatToolbarModule, MatButtonModule, MatButtonToggleModule],
    templateUrl: './standard-page.html',
    styleUrl: './standard-page.scss',
})
export class StandardPage {
    protected readonly themeingService = inject(ThemeingService);
    protected readonly sessionService = inject(SessionService);

    protected chooseTheme(theme: Theme) {
        this.themeingService.setUserPersistedTheme(theme);
    }

    protected readonly oauthEnabled = true; // TODO move to configuration
}
