import { Component, inject, input, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DiagramsList } from "./diagrams-list/diagrams-list";
import { StandardPage } from "../standard-page/standard-page";
import { WikipediaDiagramService, type Diagram, type PartyForLegend } from "./wikipedia-diagram.service.js";
import type { FieldState } from "@angular/forms/signals";

@Component({
    selector: "app-diagram-gen-page",
    imports: [
        StandardPage, DiagramsList,
        MatButtonModule, MatTooltipModule,
    ],
    templateUrl: "./diagram-gen-page.html",
    styleUrl: "./diagram-gen-page.scss",
})
export class DiagramGenPage<DiagramData> {
    private readonly wikipediaDiagramService = inject(WikipediaDiagramService);

    readonly diagramForm = input.required<FieldState<DiagramData>>();
    readonly diagramGenerator = input.required<(data: DiagramData) => readonly [ SVGSVGElement, readonly PartyForLegend[] ]>();

    protected readonly diagrams = signal<readonly Diagram[]>([]);

    protected generateDiagram() {
        const [ svg, parties ] = this.diagramGenerator()(this.diagramForm().value());
        const legend = this.wikipediaDiagramService.getLegend(parties);
        this.diagrams.update(l => [ { svg, legend }, ...l ]);
    }
}
