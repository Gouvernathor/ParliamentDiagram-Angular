import { Component, input } from "@angular/core";
import { Diagram } from "../wikipedia-diagram.service";
import { DiagramCard } from "./diagram-list-inner/diagram-card/diagram-card";
import { DiagramListInner } from "./diagram-list-inner/diagram-list-inner";

@Component({
    selector: "app-diagrams-list",
    imports: [DiagramCard, DiagramListInner],
    templateUrl: "./diagrams-list.html",
    styleUrl: "./diagrams-list.scss",
})
export class DiagramsList {
    readonly diagrams = input.required<readonly Diagram[]>();
}
