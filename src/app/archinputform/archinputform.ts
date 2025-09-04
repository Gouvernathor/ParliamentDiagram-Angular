import { Component } from '@angular/core';
import { FillingStrategy } from 'parliamentarch/geometry';

interface Party {
    readonly nId: number;
    name: string;
    nSeats: number;
    fillColor: string;
    borderWidth: number;
    borderColor: string;
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
            name: newName,
            nSeats: newNSeats,
            fillColor: newColor,
            borderWidth: 0,
            borderColor: "#000000",
        });
    }

    private callDiagramScript() {
        // TODO
    }
}
