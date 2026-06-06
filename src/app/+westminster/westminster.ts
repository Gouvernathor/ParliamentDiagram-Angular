import { Component, signal } from "@angular/core";
import { applyEach, form, max, min } from "@angular/forms/signals";
import { StandardPage } from "../shared/standard-page/standard-page";
import { Partylist } from "./partylist/partylist";

interface DiagramData {
    parties: readonly unknown[];
    wingNRows: number;
    crossNCols: number;
    packed: boolean;
    roundingRadius: number;
    spacingFactor: number;
}

@Component({
    imports: [StandardPage, Partylist],
    templateUrl: "./westminster.html",
    styleUrl: "./westminster.scss",
})
export class WestminsterPage {
    private readonly diagramModel = signal<DiagramData>({
        parties: [],
        wingNRows: 0,
        crossNCols: 0,
        packed: true,
        roundingRadius: 0,
        spacingFactor: .1,
    });
    protected readonly diagramForm = form(this.diagramModel, schemaPath => {
        applyEach(schemaPath.parties, party => {});

        min(schemaPath.wingNRows, 0);

        min(schemaPath.crossNCols, 0);

        min(schemaPath.roundingRadius, 0);
        max(schemaPath.roundingRadius, 1);

        min(schemaPath.spacingFactor, 0);
        max(schemaPath.spacingFactor, 1);
    });
}
