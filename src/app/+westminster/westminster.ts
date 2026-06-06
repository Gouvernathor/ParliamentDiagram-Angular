import { Component } from "@angular/core";
import { StandardPage } from "../shared/standard-page/standard-page";
import { Partylist } from "./partylist/partylist";

@Component({
    imports: [StandardPage, Partylist],
    templateUrl: "./westminster.html",
    styleUrl: "./westminster.scss",
})
export class WestminsterPage {}
