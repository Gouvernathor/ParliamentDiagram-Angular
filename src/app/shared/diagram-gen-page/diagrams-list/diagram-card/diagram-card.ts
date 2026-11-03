import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    linkedSignal,
    signal,
} from "@angular/core";
import { form, FormField } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ApiErrors } from "@gouvernathor/m3api";
import { Contents } from "../../../contents.directive";
import { diagramToBlob, downloadDiagram } from "../../../download";
import { SESSION_SERVICE } from "../../../oauth/conditional-inject";
import { Diagram, WikipediaDiagramService } from "../../wikipedia-diagram.service";

type Result = {
    readonly success: true;
    readonly href: string;
} | {
    readonly success: false;
    readonly messages: readonly string[];
    readonly linkToTracker: boolean;
};

@Component({
    selector: "app-diagram-card",
    imports: [
        Contents,
        FormField,
        MatButtonModule, MatExpansionModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule, MatTooltipModule,
    ],
    templateUrl: "./diagram-card.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: "./diagram-card.scss",
})
export class DiagramCard {
    protected readonly sessionService = inject(SESSION_SERVICE);
    private readonly wikipediaDiagramService = inject(WikipediaDiagramService);

    readonly diagram = input.required<Diagram>();

    protected readonly preFilenameForm = form(signal({
        year: this.currentYear(),
        country: "",
        locality: "",
        bodyName: "",
    }));
    protected readonly fileName = linkedSignal(() => {
        const filenameElements: string[] = [];
        const filenameForm = this.preFilenameForm().value();
        if (filenameForm.country) {
            filenameElements.push(filenameForm.country);
        }
        if (filenameForm.locality) {
            filenameElements.push(filenameForm.locality);
        }
        if (filenameForm.bodyName) {
            filenameElements.push(filenameForm.bodyName);
        }
        if (filenameElements.length && filenameForm.year) {
            filenameElements.push(filenameForm.year.toString());
        }

        if (!filenameElements.length) {
            filenameElements.push("My_Parliament");
        }
        return (filenameElements.join("_") + ".svg").replace(" ", "_");
    });


    protected downloadDiagram() {
        downloadDiagram(this.diagram().svg);
    }

    protected readonly isUploading = linkedSignal<object|null>(() => {
        this.preFilenameForm().value(); // reset when that is updated
        return null;
    });

    protected readonly result = signal<Result|null>(null);

    protected async uploadDiagram() {
        const uploadMarker = Object.create(null);
        this.isUploading.set(uploadMarker);

        try {
            // TODO read the result and do something about it (toast ?)
            const diagram = this.diagram();
            const filename = this.fileName();
            const result = await this.sessionService!.upload({
                filename,
                file: diagramToBlob(diagram.svg),
                description: this.wikipediaDiagramService.getDescription(diagram.legend),
            });

            if (result.upload?.result === "Success") {
                let href;
                try {
                    href = result.upload.imageinfo.descriptionurl;
                } catch (e) {
                    console.error(e);
                }
                href ||= "https://commons.wikimedia.org/wiki/File:" + filename.replace(" ", "_");

                this.result.set({ success: true, href });
            } // TODO
        } catch (e) {
            let messages;
            if (e instanceof ApiErrors) {
                messages = e.errors.map(ee => `Error (code ${ee.code}): ${ee.text}`);
            } else {
                messages = [ String(e) ];
            }
            this.result.set({ success: false, messages, linkToTracker: true });
        } finally {
            if (this.isUploading() === uploadMarker) {
                this.isUploading.set(null);
            }
        }
    }

    private currentYear(): number {
        // @ts-ignore
        return globalThis.Temporal?.Now
            .plainDateISO().year ??
            (new Date()).getFullYear();
    }
}
