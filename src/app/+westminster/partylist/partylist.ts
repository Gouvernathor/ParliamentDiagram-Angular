import { Component, input } from "@angular/core";

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
export class Partylist {}
