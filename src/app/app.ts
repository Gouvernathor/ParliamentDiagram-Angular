import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeingService } from './shared/themeing';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    protected readonly title = signal('ParliamentDiagram');

    constructor() {
        const themeingService = inject(ThemeingService);
        themeingService.applyThemeOnPage(themeingService.getUserPersistedTheme());
    }
}
