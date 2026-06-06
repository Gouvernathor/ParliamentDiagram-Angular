import { Component, input } from "@angular/core";
import { FieldState } from "@angular/forms/signals";

export interface Party {
    name: string;
    nSeats: number;
    color: string;
    borderWidth: number;
    borderColor: string;
    roundingRadius: number;
}

@Component({
    selector: "app-partylist",
    imports: [],
    templateUrl: "./partylist.html",
    styleUrl: "./partylist.scss",
})
export class Partylist {
    readonly list = input.required<FieldState<readonly Party[]>>();
}
