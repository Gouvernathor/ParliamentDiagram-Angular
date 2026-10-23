import { Component, input, output, viewChild, type ElementRef } from "@angular/core";

let allAcrossId = 0;

@Component({
    selector: "file-drop",
    imports: [],
    templateUrl: "./file-drop.html",
    styleUrl: "./file-drop.scss",
    host: {
        "(dragover)": "$event.preventDefault()",
        "(dragenter)": "$event.preventDefault()",
        "(drop)": "onDropped($event)",
    },
})
export class FileDrop {
    protected readonly inputId = `file-input-${++allAcrossId}`;
    private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>("fileInput");

    /**
     * Whether to allow multiple files to be input at once
     * (default to false).
     */
    readonly multiple = input(false);
    /**
     * The allowed MIME types.
     */
    readonly allowedTypes = input.required<readonly string[]>();

    /**
     * Emits for each dropped file.
     */
    readonly file = output<File>();
    /**
     * Emits with all the files from a single drop.
     */
    readonly files = output<readonly File[] | FileList>();

    constructor() {
        this.files.subscribe(files => {
            for (const file of files) {
                this.file.emit(file);
            }
        });
    }

    protected onDropped(event: DragEvent) {
        const files = event.dataTransfer?.files;
        if (files?.length) {
            if (!this.multiple() && files.length > 1) {
                console.warn("Multiple file drop not authorized");
                return;
            }

            const allowedTypes = this.allowedTypes();
            if (!allowedTypes.some(t => t.includes("*"))) {
                const errors = [];
                for (const file of files) {
                    if (!allowedTypes.includes(file.type)) {
                        errors.push(`File ${file.name} is of unsupported MIME type (${file.type}).`);
                    }
                }

                if (errors.length) {
                    errors.forEach(e => console.warn(e));
                    return;
                }
            }

            this.files.emit(files);
        }
    }

    protected onSelected() {
        const files = this.inputElement().nativeElement.files;
        if (files?.length) {
            this.files.emit(files);
        }
    }
}
