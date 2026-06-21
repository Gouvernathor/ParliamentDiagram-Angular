import { Component, output } from "@angular/core";

@Component({
    selector: "file-input-drop",
    imports: [],
    templateUrl: "./file-input-drop.html",
    styleUrl: "./file-input-drop.scss",
    host: {
        "(drop)": "handleDrop($event)",
    },
})
export class FileInputDrop {
    readonly files = output<FileList>();

    protected handleDrop(event: DragEvent) {
        event.preventDefault();

        const transfer = event.dataTransfer;
        if (transfer && transfer.files.length) {
            this.files.emit(transfer.files);
        }
    }

    protected onChangeFiles(event: Event, files: FileList|null) {
        event.preventDefault();

        if (files?.length) {
            this.files.emit(files);
        }
    }

    protected onPaste(event: ClipboardEvent) {
        event.preventDefault();

        const transfer = event.clipboardData;
        if (transfer && transfer.files.length) {
            this.files.emit(transfer.files);
        }
    }
}
