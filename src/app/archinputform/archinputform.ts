import { Component, computed, signal, WritableSignal } from '@angular/core';
import { getSVGFromAttribution } from 'parliamentarch';
import { FillingStrategy } from 'parliamentarch/geometry';
import { FirstChildDirective } from '../first-child.directive';

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
    imports: [ FirstChildDirective ],
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
        while (partylist.some(party => party.nId === nId)) {
            nId++;
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
            data: party.name(),
            color: party.fillColor(),
            borderSize: party.borderWidth(),
            borderColor: party.borderColor(),
        }, party.nSeats()]));

        // TODO add the other options here to the advanced options form
        const arch = getSVGFromAttribution(attrib, { fillingStrategy: this.fillingStrategy });
        this.svgs.unshift(arch);
    }
}
