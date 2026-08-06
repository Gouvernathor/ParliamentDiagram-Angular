import { Component, inject, input, linkedSignal, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltip } from "@angular/material/tooltip";
import { diagramToBlob, downloadDiagram } from "../download";
import { Contents } from "../contents.directive";
import { SESSION_SERVICE } from "../oauth/conditional-inject";
import { Diagram, WikipediaDiagramService } from "../wikipedia-diagram.service";
import { MatInput } from "@angular/material/input";
import { form, FormField } from "@angular/forms/signals";

@Component({
    selector: "app-diagram-card",
    imports: [Contents, MatButtonModule, MatExpansionModule, MatFormFieldModule, MatTooltip, MatInput, FormField],
    templateUrl: "./diagram-card.html",
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

    protected uploadDiagram() {
        // TODO read the result and do something about it (toast ?)
        const diagram = this.diagram();
        this.sessionService!.upload({
            filename: this.fileName(),
            file: diagramToBlob(diagram.svg),
            description: this.wikipediaDiagramService.getDescription(diagram.legend),
        });
    }

    private currentYear(): number {
        // @ts-ignore
        return globalThis.Temporal?.Now
            .plainDateISO().year ??
            (new Date()).getFullYear();
    }
}
