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

    protected onDropped(event: Event) {
        // TODO
    }

    protected onSelected(event: Event) {
        const files = this.inputElement().nativeElement.files;
        if (files?.length) {
            this.files.emit(files);
            for (const file of files) {
                this.file.emit(file);
            }
        }
    }
}
