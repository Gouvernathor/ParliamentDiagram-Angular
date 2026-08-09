import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from "@angular/core";

@Component({
    selector: "app-color-input",
    imports: [],
    templateUrl: "./color-input.html",
    styleUrl: "./color-input.scss",
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ColorInput {
    readonly inputId = input<string>();
    readonly value = input<string>("black");
    readonly alpha = input<boolean>(true);
    readonly valueChange = output<string>();
}
