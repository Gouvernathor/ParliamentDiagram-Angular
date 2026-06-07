import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, input } from "@angular/core";
import { FieldTree, FormField } from "@angular/forms/signals";
import { CdkDropList, CdkDrag, CdkDragHandle } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSliderModule } from "@angular/material/slider";
import { ColorService } from "../../shared/color.service";
import { ReorderingService } from "../../shared/reordering.service";

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
    imports: [
        CdkDrag, CdkDragHandle, CdkDropList,
        MatButtonModule, MatDividerModule, MatFormFieldModule, FormField,
        MatSliderModule, MatInputModule,
    ],
    templateUrl: "./partylist.html",
    styleUrl: "./partylist.scss",
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Partylist {
    private readonly colorService = inject(ColorService);
    protected readonly reorderingService = inject(ReorderingService);

    readonly list = input.required<FieldTree<readonly Party[]>>();

    protected addParty() {
        const party = this.newParty();

        this.list()().value.update(p => p.concat([party]));
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

    protected removeParty(index: number) {
        this.list()().value.update(p => {
            const s = p.slice();
            s.splice(index, 1);
            return s;
        });
    }
}
