import { Component, signal } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { StandardPage } from "../shared/standard-page/standard-page";
import { Contents } from "../shared/contents.directive";

@Component({
    imports: [StandardPage, MatExpansionModule, Contents],
    templateUrl: "./calculator.html",
    styleUrl: "./calculator.scss",
})
export class CalculatorPage {
    protected readonly diagram = signal<Element|null>(null); // TODO turn into a computed signal
}
