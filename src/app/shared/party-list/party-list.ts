import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
} from "@angular/core";
import { FieldTree, FormField } from "@angular/forms/signals";
import { CdkDrag, CdkDragHandle, CdkDropList } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSliderModule } from "@angular/material/slider";
import { ColorInput } from "../color-input/color-input";
import { ReorderingService } from "../reordering.service";
import type { BaseParty } from "./types.js";

let idd = 0;

@Component({
    selector: "app-party-list",
    imports: [
        ColorInput,
        CdkDrag, CdkDragHandle, CdkDropList,
        MatButtonModule, MatDividerModule, MatFormFieldModule, FormField,
        MatSliderModule, MatInputModule,
    ],
    templateUrl: "./party-list.html",
    styleUrl: "./party-list.scss",
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class PartyList<Party extends BaseParty> {
    protected readonly reorderingService = inject(ReorderingService);

    protected readonly id = idd++;

    readonly list = input.required<FieldTree<readonly Party[]>>();
    readonly newParty = input.required<() => Party>();
    readonly bottomAddPartyButton = input.required<boolean>();

    protected addParty() {
        this.reorderingService.add(this.list()().value, this.newParty()());
    }
}
