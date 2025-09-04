import { Component, computed, ElementRef, inject, Renderer2, signal, WritableSignal } from '@angular/core';
import { getSVGFromAttribution } from 'parliamentarch';
import { FillingStrategy } from 'parliamentarch/geometry';

interface Party {
    readonly nId: number;
    name: WritableSignal<string>;
    nSeats: WritableSignal<number>;
    fillColor: WritableSignal<string>;
    borderWidth: WritableSignal<number>;
    borderColor: WritableSignal<string>;
}

@Component({
  selector: 'app-archinputform',
  imports: [],
  templateUrl: './archinputform.html',
  styleUrl: './archinputform.scss'
})
export class Archinputform {
    // imports for the template
    FillingStrategy = FillingStrategy;
    isInt = Number.isInteger;

    fillingStrategy = FillingStrategy.DEFAULT;
    isAdvancedHidden = true;
    readonly partylist = signal<readonly Party[]>([]);
    readonly totalSeats = computed(() =>
        this.partylist().reduce((sum, party) => sum + party.nSeats(), 0));
    readonly svgs: SVGSVGElement[] = [];

    readonly renderer = inject(Renderer2);
    readonly elementRef = inject<ElementRef<Element>>(ElementRef);

    toggleAdvanced() {
        this.isAdvancedHidden = !this.isAdvancedHidden;
    }

    addPartyManual() {
        this.addParty();
    }

    deleteParty(nId: number) {
        const newPartylist = this.partylist().filter(party => party.nId !== nId);
        this.partylist.set(newPartylist);
    }

    makeDiagram() {
        this.callDiagramScript();
    }

    downloadSVG(svg: SVGSVGElement) {
        // TODO
    }

    private addParty({
        newName = "",
        newColor = "#c60", // TODO default to randomcolor
        newNSeats = 0,
    } = {}) {
        const partylist = this.partylist();
        let nId = 1;
        for (const party of partylist) {
            if (party.nId >= nId) {
                nId = party.nId + 1;
            }
        }

        newName ||= `Party ${nId}`;

        const newParty = {
            nId,
            name: signal(newName),
            nSeats: signal(newNSeats),
            fillColor: signal(newColor),
            borderWidth: signal(0),
            borderColor: signal("#000000"),
        };
        this.partylist.set(partylist.concat([newParty]));
    }

    private callDiagramScript() {
        // TODO create mediawiki markup legend
        const attrib = new Map(this.partylist().map(party => [{
            id: party.nId.toFixed(),
            data: party.name(),
            color: party.fillColor(),
            borderSize: party.borderWidth(),
            borderColor: party.borderColor(),
        }, party.nSeats()]));

        // TODO add the other options here to the advanced options form
        const arch = getSVGFromAttribution(attrib, undefined, { fillingStrategy: this.fillingStrategy }, {});
        this.svgs.unshift(arch);
    }

    setPFirstChild(p: HTMLParagraphElement, svg: SVGSVGElement) {
        const firstChild = p.firstChild;
        if (firstChild !== svg) {
            p.insertBefore(svg, firstChild);
        }
    }
}
