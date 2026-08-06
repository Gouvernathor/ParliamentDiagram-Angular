import { DOCUMENT, inject, Injectable } from "@angular/core";

export interface Diagram {
    readonly svg: SVGSVGElement;
    readonly legend: string;
}

interface PartyForLegend {
    color: string;
    name: string;
    nSeats: number;
}

@Injectable({
    providedIn: "root",
})
export class WikipediaDiagramService {
    private readonly document = inject(DOCUMENT);

    getLegend(parties: readonly PartyForLegend[]): string {
        return parties
            .map(({color, name, nSeats}) =>
                `{{legend|${color}|${name}: ${nSeats} seat${nSeats > 1 ? "s" : ""}}}`)
            .join(" ");
    }

    getDescription(legendtext: string) {
        return `== {{int:filedesc}} ==
{{Information
|description = ${legendtext}
|date = ${this.getToday()}
|source = [${this.currentURL()} Parliament diagram tool]
|author = [[User:{{subst:REVISIONUSER}}]]
|permission = {{PD-wpdc}}
|other versions =
}}

[[Category:Election apportionment diagrams]]
`;
    }

    private getToday(): string {
        // @ts-ignore
        return globalThis.Temporal?.Now
            .plainDateISO().toString() ??
            (new Date()).toISOString().split("T")[0];
    }

    private currentURL() {
        // without the query params and the hash fragment
        return this.document.location.origin + this.document.location.pathname;
    }
}
