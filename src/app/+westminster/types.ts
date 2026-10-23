
export const areas = ["speak", "government", "opposition", "cross"] as const;
export type Area = (typeof areas)[number];

export interface Party {
    name: string;
    nSeats: number;
    color: string;
    borderWidth: number;
    borderColor: string;
    roundingRadius: number | null;
}

export type PartiesPerArea = {
    [s in Area]: readonly Party[];
};
