import { Component, computed, signal, WritableSignal } from '@angular/core';
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
    readonly partylist: Party[] = [];
    readonly totalSeats = computed(() =>
        this.partylist.reduce((sum, party) => sum + party.nSeats(), 0));

    toggleAdvanced() {
        this.isAdvancedHidden = !this.isAdvancedHidden;
    }

    addPartyManual() {
        this.addParty();
    }

    deleteParty(nId: number) {
        const index = this.partylist.findIndex(party => party.nId === nId);
        this.partylist.splice(index, 1);
    }

    makeDiagram() {
        this.callDiagramScript();
    }

    private addParty({
        newName = "",
        newColor = "#c60", // TODO default to randomcolor
        newNSeats = 0,
    } = {}) {
        let nId = 1;
        for (const party of this.partylist) {
            if (party.nId >= nId) {
                nId = party.nId + 1;
            }
        }

        newName ||= `Party ${nId}`;

        this.partylist.push({
            nId,
            name: signal(newName),
            nSeats: signal(newNSeats),
            fillColor: signal(newColor),
            borderWidth: signal(0),
            borderColor: signal("#000000"),
        });
    }

    private callDiagramScript() {
        // TODO
    }
}
