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
    readonly messages: Errors | readonly Message[];
    readonly retryIgnoreWarnings: boolean;
};

type Errors = {
    readonly errors: string[];
};

type Message = {
    readonly kind: "badfilename";
    readonly badfilename: string;
} | {
    readonly kind: "was-deleted";
    readonly filename: string;
} | {
    readonly kind: "unknown";
    readonly key: string;
    readonly value: string;
};

const resultCache = new WeakMap<Diagram, Result>();

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

    protected readonly result = linkedSignal<Result|undefined>(() => resultCache.get(this.diagram())); // signal<Result|null>(null);
    private setResult(result: Result, diagram = this.diagram()) {
        resultCache.set(diagram, result);
        this.result.set(result);
    }

    protected async uploadDiagram() {
        const uploadMarker = Object.create(null);
        this.isUploading.set(uploadMarker);

        const diagram = this.diagram();
        try {
            // TODO read the result and do something about it (toast ?)
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

                this.setResult({ success: true, href }, diagram);
            } else if (result.upload.warnings) {
                const warnings = Object.assign(Object.create(null), result.upload.warnings);
                const messages: Message[] = [];
                let retryIgnoreWarnings = true;

                if ("badfilename" in warnings) {
                    messages.push({
                        kind: "badfilename",
                        badfilename: warnings["badfilename"],
                    });
                    retryIgnoreWarnings = false;
                    delete warnings["badfilename"];
                } else if ("exists" in warnings || "was-deleted" in warnings) {
                    if ("was-deleted" in warnings) {
                        messages.push({
                            kind: "was-deleted",
                            filename: warnings["was-deleted"],
                        });
                    } else {
                        const href = `https://commons.wikipedia.org/wiki/File:${warnings["exists"]}`;
                        if ("no-change" in warnings) {
                            /* messages.push({
                                kind: ,
                            }); */ // TODO
                            retryIgnoreWarnings = false;
                        } else if ("duplicateversions" in warnings) {
                            /* messages.push({
                                kind: ,
                            }); */ // TODO
                        } else {
                            /* messages.push({
                                kind: ,
                            }); */ // TODO
                        }
                    }
                    delete warnings["exists"];
                    delete warnings["no-change"];
                    delete warnings["duplicateversions"];
                    delete warnings["was-deleted"];
                } else if ("duplicate" in warnings || "duplicate-archive" in warnings) {
                    if ("duplicate" in warnings) {
                        /* messages.push({
                            kind: ,
                        }); */ // TODO
                    }
                    if ("duplicate-archive" in warnings) {
                        /* messages.push({
                            kind: ,
                        }); */ // TODO
                    }
                    delete warnings["duplicate"];
                    delete warnings["duplicate-archive"];
                }
                if (Object.keys(warnings).length) {
                    for (const key in warnings) {
                        const value = warnings[key];
                        messages.push({
                            kind: "unknown",
                            key, value,
                        });
                    }
                }

                this.setResult({ success: false, messages, retryIgnoreWarnings });
            }
        } catch (e) {
            let errors;
            if (e instanceof ApiErrors) {
                errors = e.errors.map(ee => `Error (code ${ee.code}): ${ee.text}`);
            } else {
                errors = [ String(e) ];
            }
            this.setResult({ success: false, messages: { errors }, retryIgnoreWarnings: false }, diagram);
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
