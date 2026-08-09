import { Service } from "@angular/core";
import { getSVGFromAttribution, GetSVGFromAttributionOptions, SeatData } from "@parliamentarch/svg";
import { FieldState } from "@angular/forms/signals";
import { Writeable } from "../shared/utils/types";
import { Party as PresetParty } from "./presets";

interface Party extends PresetParty {
    readonly nYea: number;
    readonly nNay: number;
}

export interface CalculatorData {
    readonly parties: readonly Party[];

    // calculation options
    readonly majorityRatio: number | null;
    readonly majorityThreshold: number | null;
    readonly countAbstainAsAgainst: boolean;
    readonly displayAbstainIfNotCountedAsAgainst: boolean;

    readonly editPartyList: boolean;

    // display options
    readonly borderThickness: number; // maybe double this for Nay and Abstain separately
}

@Service()
export class CalculatorService {
    getDiagram(form: FieldState<CalculatorData>): Element|null {
        if (!form.valid()) {
            return null;
        }

        const value = form.value();
        return getSVGFromAttribution(this.getAttrib(value), this.getOptions(value));
    }

    private getAttrib({
        parties,
        countAbstainAsAgainst,
        displayAbstainIfNotCountedAsAgainst,
        borderThickness,
    }: Pick<CalculatorData, "parties"|"countAbstainAsAgainst"|"displayAbstainIfNotCountedAsAgainst"|"borderThickness">): ReadonlyMap<SeatData, number> {
        const computedParties = parties.map(p => ({ nAbstain: p.nSeats - (p.nYea + p.nNay), ...p }));
        const totalNAbstain = computedParties.reduce((a, p) => a + p.nAbstain, 0);
        const nLeftAbstain = Math.trunc(totalNAbstain/2);

        const yea = computedParties
            .map<[SeatData, number]|null>(p => {
                if (p.nYea <= 0) {
                    return null;
                }

                return [this.yeaParty(p.name, p.color), p.nYea];
            })
            .filter(p => p != null);
        const nay = computedParties
            .map<[SeatData, number]|null>(p => {
                if (p.nNay <= 0) {
                    return null;
                }

                return [this.nayParty(p.name, p.color, borderThickness), p.nNay];
            })
            .filter(p => p != null);

        if (countAbstainAsAgainst) {
            const abstain = computedParties
                .map<[SeatData, number]|null>(p => {
                    if (p.nAbstain <= 0) {
                        return null;
                    }

                    return [this.abstainParty(p.name, p.color, borderThickness), p.nAbstain];
                })
                .filter(p => p != null);

            // could also display yea-nay-abstain
            return new Map([...yea, ...abstain, ...nay]);
        } else if (!displayAbstainIfNotCountedAsAgainst) {
            return new Map([...yea, ...nay]);
        } else {
            const leftAbstain: [SeatData, number][] = [];
            const rightAbstain: [SeatData, number][] = [];
            let nPlacedLeftAbstain = 0;
            const abstainPartiesToPop = computedParties.slice();
            while (nPlacedLeftAbstain < nLeftAbstain) {
                const party = abstainPartiesToPop.shift();
                if (party == null) {
                    throw new Error("bad computation of the number of left-abstain parties");
                }

                if (party.nAbstain + nPlacedLeftAbstain > nLeftAbstain) {
                    const nPlacedLeft = nLeftAbstain - nPlacedLeftAbstain;
                    leftAbstain.push([this.abstainParty(party.name, party.color, borderThickness), nPlacedLeft]);
                    nPlacedLeftAbstain = nLeftAbstain;

                    // add the right part to rightAbstain
                    rightAbstain.push([this.abstainParty(party.name, party.color, borderThickness), party.nAbstain-nPlacedLeft]);
                } else {
                    leftAbstain.push([this.abstainParty(party.name, party.color, borderThickness), party.nAbstain]);
                    nPlacedLeftAbstain += party.nAbstain;
                }
            }
            // map the remaining abstainPartiesToPop and append them to rightAbstain
            for (const party of abstainPartiesToPop) {
                rightAbstain.push([this.abstainParty(party.name, party.color, borderThickness), party.nAbstain]);
            }

            return new Map([...leftAbstain, ...yea, ...nay, ...rightAbstain]);
        }
    }

    private yeaParty(name: string, color: string): SeatData {
        return {
            data: name,
            color,
        };
    }

    private abstainParty(name: string, color: string, borderThickness: number): SeatData {
        return {
            data: name,
            color: "transparent",
            borderColor: color,

            // TODO support dashed line in ParliamentArch,
            // or set it using a class with ng-deep,
            // and then remove this /2
            borderSize: borderThickness/2,
        };
    }

    private nayParty(name: string, color: string, borderThickness: number) {
        return {
            data: name,
            color: "transparent",
            borderColor: color,
            borderSize: borderThickness,
        };
    }

    private getOptions({
        majorityRatio,
        majorityThreshold,
    }: Pick<CalculatorData, "majorityRatio"|"majorityThreshold">): Partial<Readonly<GetSVGFromAttributionOptions>> {
        const checkpoint: Writeable<GetSVGFromAttributionOptions["majorityLines"][number]> = {
            // TODO (maybe)
            // data,
            // color,
            // width,
            // dasharray,

            // round,
        };

        if (majorityRatio != null) {
            checkpoint.ratio = majorityRatio;
        } else if (majorityThreshold != null) {
            checkpoint.nSeats = majorityThreshold;
        }

        return {
            // TODO (maybe)
            // seatRadiusFactor,
            // minNRows,
            // fillingStrategy,
            // spanAngle,
            seatNumberFontSizeFactor: 0,

            majorityLineCheckpoints: [],
        };
    }
}
