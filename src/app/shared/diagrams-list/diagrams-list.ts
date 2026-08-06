import { Component, computed, input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { DiagramCard } from "../diagram-card/diagram-card";
import { Diagram } from "../wikipedia-diagram.service";

@Component({
    selector: "app-diagrams-list",
    imports: [DiagramCard, MatExpansionModule],
    templateUrl: "./diagrams-list.html",
    styleUrl: "./diagrams-list.scss",
})
export class DiagramsList {
    readonly diagrams = input.required<readonly Diagram[]>();

    protected readonly first = computed(() => this.diagrams()[0]!);
    protected readonly others = computed(() => this.diagrams().slice(1));
}
