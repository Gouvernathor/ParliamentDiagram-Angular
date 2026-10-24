import { Component, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { applyEach, form, max, min, validate, FormField } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatTooltipModule } from "@angular/material/tooltip";
import { getSVGFromAttribution } from "@parliamentarch/westminster-svg";
import { StandardPage } from "../shared/standard-page/standard-page";
import { Partylist } from "./partylist/partylist";
import { Party } from "./types";
import { DiagramsList } from "../shared/diagrams-list/diagrams-list";
import { Diagram, WikipediaDiagramService } from "../shared/wikipedia-diagram.service";
import { areas, type PartiesPerArea } from "./types.js";
import { FileDrop } from "../shared/file-drop/file-drop.js";
import { ExtractDiagram } from "../shared/file-drop/extract-diagram.js";
import { SvgToPreset } from "./svg-to-preset.js";

interface DiagramData {
    parties: PartiesPerArea;
    wingNRows: number;
    crossNCols: number;
    packed: boolean;
    roundingRadius: number;
    spacingFactor: number;
}

const INITIAL_SPEAKER: Readonly<Party> = {
    name: "Speaker",
    nSeats: 1,
    color: "black",
    borderWidth: 0,
    borderColor: "black",
    roundingRadius: null,
};

@Component({
    imports: [
        StandardPage, Partylist, DiagramsList, FileDrop, ExtractDiagram,
        FormField,
        MatExpansionModule,
        MatButtonModule, MatInputModule, MatSliderModule, MatSlideToggleModule, MatTooltipModule,
    ],
    templateUrl: "./westminster.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: "./westminster.scss",
})
export class WestminsterPage {
    private readonly wikipediaDiagramService = inject(WikipediaDiagramService);
    protected readonly svgToPresetService = inject(SvgToPreset);

    private readonly diagramModel = signal<DiagramData>({
        parties: {
            speak: [{ ...INITIAL_SPEAKER }],
            government: [],
            opposition: [],
            cross: [],
        },
        wingNRows: 0,
        crossNCols: 0,
        packed: true,
        roundingRadius: 0,
        spacingFactor: .1,
    });
    protected readonly diagramForm = form(this.diagramModel, schemaPath => {
        for (const area of areas) {
            applyEach(schemaPath.parties[area], party => {
                min(party.nSeats, 0);

                min(party.borderWidth, 0);
                max(party.borderWidth, 1);

                min(party.roundingRadius, 0);
                max(party.roundingRadius, 1);
            });
        }
        validate(schemaPath.parties, ({ value }) => {
            const v = value();
            const totalNSeats = areas.flatMap(a => v[a]).reduce((a, p) => a+p.nSeats, 0);
            if (totalNSeats <= 0) {
                return {
                    kind: "minimum seats",
                    message: "There must be at least one seat",
                };
            }
            return;
        });

        min(schemaPath.wingNRows, 0);

        min(schemaPath.crossNCols, 0);

        min(schemaPath.roundingRadius, 0);
        max(schemaPath.roundingRadius, .5);

        min(schemaPath.spacingFactor, 0.0000000000000000000001);
        max(schemaPath.spacingFactor, 1);
    });

    protected readonly diagrams = signal<readonly Diagram[]>([]);

    protected applyPreset(preset: PartiesPerArea) {
        this.diagramForm.parties().value.set(preset);
    }

    /* private savePreset() {
        downloadJson(this.diagramForm.parties().value());
    } */

    protected generateDiagram() {
        const value = this.diagramForm().value();
        const attrib = areas.flatMap(area => value.parties[area].map(p =>({
                area,
                nSeats: p.nSeats,

                data: p.name,
                color: p.color,
                borderSize: p.borderWidth,
                borderColor: p.borderColor,
                roundingRadius: p.roundingRadius,
            })));
        const options = {
            wingNRows: value.wingNRows,
            crossNCols: value.crossNCols,
            packed: value.packed,
            roundingRadius: value.roundingRadius,
            spacingFactor: value.spacingFactor,
        };

        const partiesForLegend = areas
            .filter(a => a != "speak")
            .flatMap(a => value.parties[a]);

        const diagram = getSVGFromAttribution(attrib, options);
        this.diagrams.update(l => [
            {
                svg: diagram,
                legend: this.wikipediaDiagramService.getLegend(partiesForLegend),
            },
            ...l,
        ]);
    }
}
