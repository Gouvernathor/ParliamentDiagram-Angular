import { Component, computed, DOCUMENT, inject, signal, WritableSignal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { getSVGFromAttribution } from 'parliamentarch';
import { FillingStrategy } from 'parliamentarch/geometry';
import { arraySignal } from '../../util/array-signal';
import { randomColor } from '../../util/random-color';
import { FirstChildDirective } from '../utility/first-child.directive';
import { ArchOptions, AdvancedOptions } from './advanced-options/advanced-options';
import { PercentPipe } from '@angular/common';

interface Party {
    readonly nId: number;
    readonly name: WritableSignal<string>;
    readonly nSeats: WritableSignal<number>;
    readonly fillColor: WritableSignal<string>;
    readonly borderWidth: WritableSignal<number>;
    readonly borderColor: WritableSignal<string>;
}

@Component({
    selector: 'app-archinputform',
    imports: [FirstChildDirective, CdkDrag, CdkDropList, CdkDragHandle, AdvancedOptions, PercentPipe],
    templateUrl: './archinputform.html',
    styleUrl: './archinputform.scss'
})
export class Archinputform {
    readonly document = inject(DOCUMENT);

    // imports for the template
    FillingStrategy = FillingStrategy;
    isInt = Number.isInteger;

    readonly advancedShown = signal(false);
    readonly rawOptions = signal<ArchOptions|undefined>(undefined);
    readonly options = computed(() => this.advancedShown() ? this.rawOptions() : undefined);
    readonly partylist = arraySignal<Party>();
    readonly totalSeats = computed(() =>
        this.partylist().reduce((sum, party) => sum + party.nSeats(), 0));
    readonly svgs: SVGSVGElement[] = [];

    toggleAdvanced() {
        this.advancedShown.set(!this.advancedShown());
    }

    addPartyManual() {
        this.addParty();
    }

    deleteParty(nId: number) {
        const newPartylist = this.partylist().filter(party => party.nId !== nId);
        this.partylist.splice(0, this.partylist().length, ...newPartylist);
    }

    drop(event: CdkDragDrop<Party[]>) {
        this.partylist.splice(event.currentIndex, 0, ...this.partylist.splice(event.previousIndex, 1));
    }

    makeDiagram() {
        this.callDiagramScript();
    }

    downloadSVG(svg: SVGSVGElement) {
        const a = this.document.createElement("a");
        let url = "";
        try {
            url = URL.createObjectURL(new Blob([svg.outerHTML], { type: "image/svg+xml" }));
            a.href = url;
            a.download = "parliamentdiagram.svg";
            a.click();
        } finally {
            if (url) {
                URL.revokeObjectURL(url);
            }
        }
    }

    private addParty({
        newName = "",
        newColor = randomColor(),
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
        this.partylist.push(newParty);
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
        const arch = getSVGFromAttribution(attrib, this.options());
        this.svgs.unshift(arch);
    }
}
