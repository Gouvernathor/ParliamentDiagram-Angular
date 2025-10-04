import { Component, DOCUMENT, inject } from '@angular/core';
import * as arch from 'parliamentarch';
import * as westminster from 'parliamentarch/westminster';
import { ChildrenDirective } from "../children.directive";

@Component({
    selector: 'app-cards',
    imports: [ChildrenDirective],
    templateUrl: './cards.html',
    styleUrl: './cards.scss'
})
export class Cards {
    readonly document = inject<Document>(DOCUMENT);

    readonly arch: SVGSVGElement;
    readonly westminster: SVGSVGElement;
    readonly vote!: SVGSVGElement; // TODO

    constructor() {
        globalThis.document ??= this.document;
        const archAttribution = new Map([
            [{ color: "#DD0000" }, 17],
            [{ color: "#cc2443" }, 71],
            [{ color: "#00c000" }, 38],
            [{ color: "#ff8080" }, 66],
            [{ color: "#e1a5e1" }, 23],
            [{ color: "#ff9900" }, 36],
            [{ color: "#ffeb00" }, 93],
            [{ color: "#0001b8" }, 34],
            [{ color: "#0066cc" }, 47],
            [{ color: "#162561" }, 16],
            [{ color: "#0d378a" }, 124],
            [{ color: "#dddddd" }, 9],
            [{ color: "#ffffff" }, 3],
        ]);
        this.arch = arch.getSVGFromAttribution(archAttribution);

        const westAttribution = {
            speak: [
                [{ color: "black" }, 1] as const,
            ],
            government: [
                [{ color: "blue" }, 61] as const,
                [{ color: "rebeccapurple" }, 59] as const,
            ],
            opposition: [
                [{ color: "red" }, 51] as const,
                [{ color: "orange" }, 49] as const,
            ],
            cross: [
                [{ color: "green" }, 7] as const,
            ],
        };
        this.westminster = westminster.getSVGFromAttribution(westAttribution);
    }
}
