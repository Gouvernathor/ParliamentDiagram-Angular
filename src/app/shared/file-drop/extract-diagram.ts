import { Directive, inject, input, output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import type { BaseSvgConverter } from "../base-svg-converter.js";

@Directive({
    selector: "file-drop[converter]",
    host: {
        "(file)": "convertFile($any($event))",
    },
})
export class ExtractDiagram<Preset> {
    private readonly snackbar = inject(MatSnackBar);

    readonly converter = input.required<BaseSvgConverter<Preset>>();
    readonly preset = output<Preset>();

    protected async convertFile(f: File) {
        try {
            const val = await this.converter().extract(f);
            this.preset.emit(val);
        } catch (e) {
            this.snackbar.open(`Error when extracting data from diagram: ${e}`, undefined, {
                duration: 5000,
                horizontalPosition: "right",
            });
        }
    }
}
