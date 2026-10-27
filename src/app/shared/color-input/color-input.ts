import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, input, output } from "@angular/core";
import { type ChangeDetail } from "hdr-color-input";
import { ThemeingService } from "../themeing.js";

type ChangeEvent = Event & { readonly detail: ChangeDetail };

@Component({
    selector: "app-color-input",
    imports: [],
    templateUrl: "./color-input.html",
    styleUrl: "./color-input.scss",
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ColorInput {
    private readonly themeService = inject(ThemeingService);

    readonly inputId = input<string>();
    readonly value = input<string>("black");
    readonly alpha = input<boolean>(true);
    readonly valueChange = output<string>();

    protected readonly theme = computed((): "auto"|"light"|"dark" => {
        const theme = this.themeService.getUserPersistedTheme();
        switch (theme) {
            case null:
                return "auto";

            case "light":
            case "dark":
                return theme;
        }
    });

    protected onChange(e: ChangeEvent) {
        const { detail } = e;
        this.valueChange.emit(detail.value);
    }
}
