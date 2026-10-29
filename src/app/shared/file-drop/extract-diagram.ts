import { Directive, inject, input, output } from "@angular/core";
import type { BaseSvgConverter } from "../base-svg-converter.js";
import { Toast } from "../toast.js";

@Directive({
    selector: "file-drop[converter]",
    host: {
        "(file)": "convertFile($any($event))",
    },
})
export class ExtractDiagram<Preset> {
    private readonly toaster = inject(Toast);

    readonly converter = input.required<BaseSvgConverter<Preset>>();
    readonly preset = output<Preset>();

    protected async convertFile(f: File) {
        try {
            const val = await this.converter().extract(f);
            this.preset.emit(val);
        } catch (e) {
            this.toaster.error(`Error when extracting data from diagram: ${e}`);
        }
    }
}
