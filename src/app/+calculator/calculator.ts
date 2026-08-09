import { Component } from "@angular/core";
import { StandardPage } from "../shared/standard-page/standard-page";
import { MatExpansionModule } from "@angular/material/expansion";

@Component({
    imports: [StandardPage, MatExpansionModule],
    templateUrl: "./calculator.html",
    styleUrl: "./calculator.scss",
})
export class CalculatorPage {}
