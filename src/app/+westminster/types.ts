import { BaseParty } from "../shared/party-list/types.js";

export const areas = ["speak", "government", "opposition", "cross"] as const;
export type Area = (typeof areas)[number];

export interface Party extends BaseParty {
    roundingRadius: number | null;
}

export type PartiesPerArea = {
    [s in Area]: readonly Party[];
};
