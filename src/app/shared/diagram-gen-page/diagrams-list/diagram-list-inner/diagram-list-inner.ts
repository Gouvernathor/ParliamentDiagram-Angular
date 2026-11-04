import { Component, input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";

@Component({
    imports: [MatExpansionModule],
    selector: "app-diagram-list-inner",
    styleUrl: "./diagram-list-inner.scss",
    templateUrl: "./diagram-list-inner.html",
})
export class DiagramListInner {
    readonly haveMore = input.required<boolean>();
}
