import { Component, signal } from "@angular/core";
import { applyEach, form, max, min } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { downloadBlob } from "canvas-blob-manager/copyDownloadBlob";
import { getSVGFromAttribution } from "@parliamentarch/westminster-svg";
import { StandardPage } from "../shared/standard-page/standard-page";
import { Contents } from "../shared/contents";
import { Party, Partylist } from "./partylist/partylist";

const shapes = ["speak", "government", "opposition", "cross"] as const;
type Shape = typeof shapes[number];

interface DiagramData {
    parties: {
        [s in Shape]: readonly Party[];
    };
    wingNRows: number;
    crossNCols: number;
    packed: boolean;
    roundingRadius: number;
    spacingFactor: number;
}

@Component({
    imports: [
        StandardPage, Partylist, Contents,
        MatButtonModule, MatTooltipModule,
    ],
    templateUrl: "./westminster.html",
    styleUrl: "./westminster.scss",
})
export class WestminsterPage {
    private readonly diagramModel = signal<DiagramData>({
        parties: {
            speak: [],
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
        for (const shape of shapes) {
            applyEach(schemaPath.parties[shape], party => {
                min(party.nSeats, 0);

                min(party.borderWidth, 0);
                max(party.borderWidth, 1);

                min(party.roundingRadius, 0);
                max(party.roundingRadius, 1);
            });
        }

        min(schemaPath.wingNRows, 0);

        min(schemaPath.crossNCols, 0);

        min(schemaPath.roundingRadius, 0);
        max(schemaPath.roundingRadius, 1);

        min(schemaPath.spacingFactor, 0);
        max(schemaPath.spacingFactor, 1);
    });

    protected readonly diagrams = signal<readonly SVGSVGElement[]>([]);

    protected generateDiagram() {
        const value = this.diagramForm().value();
        const attrib = shapes.flatMap(shape => value.parties[shape].map(p =>({
            area: shape,
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

        const diagram = getSVGFromAttribution(attrib, options);
        this.diagrams.update(l => [ diagram ].concat(l));
    }

    protected downloadDiagram(diagram: SVGSVGElement) {
        const blob = new Blob([diagram.outerHTML], { type: "image/svg+xml" });
        downloadBlob(blob, "parliament-diagram.svg");
    }
}
