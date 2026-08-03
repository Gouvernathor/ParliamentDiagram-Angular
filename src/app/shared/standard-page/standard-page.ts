import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Theme, ThemeingService } from '../themeing';

@Component({
    selector: 'app-standard-page',
    imports: [RouterLink, MatCardModule, MatToolbarModule, MatButtonToggleModule],
    templateUrl: './standard-page.html',
    styleUrl: './standard-page.scss',
})
export class StandardPage {
    protected readonly themeingService = inject(ThemeingService);

    protected chooseTheme(theme: Theme) {
        this.themeingService.setUserPersistedTheme(theme);
    }
}
