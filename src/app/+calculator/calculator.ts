import { Component, computed, effect, inject, signal } from "@angular/core";
import { PercentPipe } from "@angular/common";
import { applyEach, form, max, min, minLength, validate, FormField } from "@angular/forms/signals";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { StandardPage } from "../shared/standard-page/standard-page";
import { Contents } from "../shared/contents.directive";
import { CalculatorData, CalculatorService, Party } from "./calculator.service";
import { Preset, presets } from "./presets";

@Component({
    imports: [
        StandardPage, Contents,
        FormField, PercentPipe,
        MatButtonToggleModule, MatCheckboxModule, MatExpansionModule, MatSelectModule, MatSliderModule,
    ],
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
        borderThickness: .3,
    }), schemaPath => {
        minLength(schemaPath.parties, 1);
        applyEach(schemaPath.parties, party => {
            min(party.nYea, 0);
            min(party.nNay, 0);

            validate(party, ({ value }) => {
                const { name, nSeats, nYea, nNay } = value();
                if (nSeats < nYea) {
                    return {
                        kind: "number of votes for",
                        message: `The number of votes for is higher than the number of seats for party ${name}`,
                    };
                }
                if (nSeats < nNay) {
                    return {
                        kind: "number of votes against",
                        message: `The number of votes against is higher than the number of seats for party ${name}`,
                    };
                }

                if (nSeats < nYea+nNay) {
                    return {
                        kind: "number of seats",
                        message: `The number of expressed votes is higher than the number of seats for party ${name}`,
                    };
                }
                return;
            });
        });
        validate(schemaPath, ({ value }) => {
            const nSeatsToDisplay = this.nSeatsToDisplay();
            if (nSeatsToDisplay <= 0) {
                return {
                    kind: "minimum seats",
                    message: "There must be at least one seat",
                };
            }

            const thresh = value().majorityThreshold;
            if (thresh && nSeatsToDisplay < thresh) {
                return {
                    kind: "threshold too high",
                    message: "The threshold cannot be higher than the number of seats",
                };
            }
            return;
        });

        min(schemaPath.majorityRatio, 0);
        max(schemaPath.majorityRatio, 1);
        min(schemaPath.majorityThreshold, 0);

        min(schemaPath.borderThickness, 0.0000000000000000000001);
        max(schemaPath.borderThickness, 1);
    });

    protected readonly totalNSeats = computed(() =>
        this.form.parties().value().reduce((a, p) => a + p.nSeats, 0));
    /**
     * Takes into account that abstain votes are sometimes not displayed
     */
    protected readonly nSeatsToDisplay = computed(() => {
        if (this.form.countAbstainAsAgainst().value() || this.form.displayAbstainIfNotCountedAsAgainst().value()) {
            return this.totalNSeats();
        }
        return this.form.parties().value().reduce((a, p) => a + p.nYea+p.nNay, 0);
    });

    protected readonly errorMessages = computed(() =>
        this.form().errorSummary().map(e => e.message).filter(m => m));

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
