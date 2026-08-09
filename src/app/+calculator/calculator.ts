import { Component, signal } from "@angular/core";
import { form, max, min, minLength, validate } from "@angular/forms/signals";
import { MatExpansionModule } from "@angular/material/expansion";
import { StandardPage } from "../shared/standard-page/standard-page";
import { Contents } from "../shared/contents.directive";

interface Party {
    readonly name: string;
    readonly nSeats: number;
    readonly color: string;
}

interface CalculatorData {
    readonly parties: readonly Party[];

    // calculation options
    readonly majorityRatio: number|null;
    readonly majorityThreshold: number|null;
    readonly countAbstainAsAgainst: boolean;
    readonly displayAbstainIfNotCountedAsAgainst: boolean;

    readonly editPartyList: boolean; // TODO set to true by default, and to false when selecting a preset

    // display options
    readonly borderThickness: number; // maybe double this for Nay and Abstain separately
    // …other global arch settings
}

@Component({
    imports: [StandardPage, MatExpansionModule, Contents],
    templateUrl: "./calculator.html",
    styleUrl: "./calculator.scss",
})
export class CalculatorPage {
    protected readonly form = form(signal<CalculatorData>({
        parties: [],
        majorityRatio: null,
        majorityThreshold: null,
        countAbstainAsAgainst: false,
        displayAbstainIfNotCountedAsAgainst: true,
        editPartyList: true,
        borderThickness: .1, // TODO tweak
    }), schemaPath => {
        minLength(schemaPath.parties, 1);
        validate(schemaPath.parties, ({ value }) => {
            const totalNSeats = value().reduce((a, p) => a + p.nSeats, 0);
            if (totalNSeats <= 0) {
                return {
                    kind: "minimum seats",
                    message: "There must be at least one seat",
                };
            }
            return;
        });

        min(schemaPath.borderThickness, 0.0000000000000000000001);
        max(schemaPath.borderThickness, 1);
    });

    protected readonly diagram = signal<Element|null>(null); // TODO turn into a computed signal
}
