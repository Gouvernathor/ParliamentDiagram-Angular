import { Component, inject, input, output, signal } from "@angular/core";
import type { FieldState } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTooltipModule } from "@angular/material/tooltip";
import type { BaseSvgConverter } from "../base-svg-converter.js";
import { ExtractDiagram } from "../file-drop/extract-diagram.js";
import { FileDrop } from "../file-drop/file-drop.js";
import { StandardPage } from "../standard-page/standard-page";
import { DiagramsList } from "./diagrams-list/diagrams-list";
import { WikipediaDiagramService, type Diagram, type PartyForLegend } from "./wikipedia-diagram.service.js";

@Component({
    selector: "app-diagram-gen-page",
    imports: [
        StandardPage, DiagramsList, FileDrop, ExtractDiagram,
        MatButtonModule, MatExpansionModule, MatTooltipModule,
    ],
    templateUrl: "./diagram-gen-page.html",
    styleUrl: "./diagram-gen-page.scss",
})
export class DiagramGenPage<DiagramData, Preset> {
    private readonly wikipediaDiagramService = inject(WikipediaDiagramService);

    readonly diagramForm = input.required<FieldState<DiagramData>>();
    readonly diagramGenerator = input.required<(data: DiagramData) => readonly [ SVGSVGElement, readonly PartyForLegend[] ]>();
    readonly converter = input.required<BaseSvgConverter<Preset>>();
    readonly preset = output<Preset>();

    protected readonly diagrams = signal<readonly Diagram[]>([]);

    protected generateDiagram() {
        const [ svg, parties ] = this.diagramGenerator()(this.diagramForm().value());
        const legend = this.wikipediaDiagramService.getLegend(parties);
        this.diagrams.update(l => [ { svg, legend }, ...l ]);
    }
}
