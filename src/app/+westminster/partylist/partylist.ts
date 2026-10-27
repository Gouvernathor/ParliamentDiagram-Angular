import {
    Component,
    inject,
    input,
    ChangeDetectionStrategy,
} from "@angular/core";
import { FieldTree, FormField } from "@angular/forms/signals";
import { CdkDropList, CdkDrag, CdkDragHandle } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSliderModule } from "@angular/material/slider";
import { ColorService } from "../../shared/color.service";
import { ReorderingService } from "../../shared/reordering.service";
import { ColorInput } from "../../shared/color-input/color-input";
import type { Party } from "../types.js";

let idd = 0;

@Component({
    selector: "app-partylist",
    imports: [
        ColorInput,
        CdkDrag, CdkDragHandle, CdkDropList,
        MatButtonModule, MatDividerModule, MatFormFieldModule, FormField,
        MatSliderModule, MatInputModule,
    ],
    templateUrl: "./partylist.html",
    styleUrl: "./partylist.scss",
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class Partylist {
    private readonly colorService = inject(ColorService);
    protected readonly reorderingService = inject(ReorderingService);

    protected readonly id = idd++;

    readonly list = input.required<FieldTree<readonly Party[]>>();

    protected addParty() {
        this.reorderingService.add(this.list()().value, this.newParty());
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
}
