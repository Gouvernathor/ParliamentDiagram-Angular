import { Component, inject, input } from "@angular/core";
import { FieldState } from "@angular/forms/signals";
import { CdkDropList, CdkDrag, CdkDragDrop } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { ColorService } from "../../shared/color.service";

export interface Party {
    name: string;
    nSeats: number;
    color: string;
    borderWidth: number;
    borderColor: string;
    roundingRadius: number|null;
}

@Component({
    selector: "app-partylist",
    imports: [CdkDropList, CdkDrag, MatButtonModule],
    templateUrl: "./partylist.html",
    styleUrl: "./partylist.scss",
})
export class Partylist {
    private readonly colorService = inject(ColorService);

    readonly list = input.required<FieldState<readonly Party[]>>();

    protected addParty() {
        const party = this.newParty();

        this.list().value.update(p => p.concat([party]));
    }

    private newParty(): Party {
        return {
            name: "",
            nSeats: 0,
            color: this.colorService.randomColor(),
            borderWidth: 0,
            borderColor: "black",
            roundingRadius: null,
        };
    }

    protected drop({ previousIndex, currentIndex }: CdkDragDrop<unknown, unknown, unknown>) {
        this.switch(previousIndex, currentIndex);
    }

    private switch(indexA: number, indexB: number) {
        this.list().value.update(p => {
            const s = p.slice();
            s.splice(indexA, 0, ...s.splice(indexB, 1));
            return s;
        });
    }
}
