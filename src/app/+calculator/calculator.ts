import { Component, computed, effect, inject, signal } from "@angular/core";
import { applyEach, form, max, min, minLength, validate } from "@angular/forms/signals";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSelectModule } from "@angular/material/select";
import { StandardPage } from "../shared/standard-page/standard-page";
import { Contents } from "../shared/contents.directive";
import { CalculatorData, CalculatorService } from "./calculator.service";
import { Preset, presets } from "./presets";

@Component({
    imports: [StandardPage, Contents, MatExpansionModule, MatSelectModule],
    templateUrl: "./calculator.html",
    styleUrl: "./calculator.scss",
})
export class CalculatorPage {
    private readonly service = inject(CalculatorService);

    protected readonly presets = presets;

    protected readonly currentPreset = signal<Preset|null>(null);
    protected readonly form = form(signal<CalculatorData>({
        parties: [],
        majorityRatio: null,
        majorityThreshold: null,
        countAbstainAsAgainst: false,
        displayAbstainIfNotCountedAsAgainst: true,
        editPartyList: true,
        borderThickness: .2,
    }), schemaPath => {
        minLength(schemaPath.parties, 1);
        applyEach(schemaPath.parties, party => {
            validate(party, ({ value }) => {
                const { name, nSeats, nYea, nNay } = value();
                if (nSeats < nYea+nNay) {
                    return {
                        kind: "number of seats",
                        message: `The number of expressed votes is higher than the number of seats for party ${name}`,
                    };
                }
                return;
            });
        });
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

    protected readonly diagram = computed<Element|null>(() => this.service.getDiagram(this.form()));

    constructor() {
        effect(() => {
            if (this.form.editPartyList().value()) {
                this.currentPreset.set(null);
            }
        });
    }

    protected usePreset(preset: Preset) {
        this.currentPreset.set(preset);
        this.form.parties().value.set(preset.parties.map(p => ({ ...p, nYea: 0, nNay: 0 })));
        this.form.editPartyList().value.set(false);
    }
}
