import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from "@angular/core";
import { applyEach, form, FormField, max, min, minLength, validate } from "@angular/forms/signals";
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSliderModule } from "@angular/material/slider";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FillingStrategy } from "@parliamentarch/core/geometry";
import { getSVGFromAttribution } from "@parliamentarch/svg";
import { Writeable } from "../shared/utils/types";
import { Contents } from "../shared/contents";
import { StandardPage } from "../shared/standard-page/standard-page";
import { ColorService } from "../shared/color.service";
import { downloadDiagram } from "../shared/download-diagram";
import { ReorderingService } from "../shared/reordering.service";

interface Party {
    name: string;
    nSeats: number;
    color: string;
    borderWidth: number;
    borderColor: string;
}

interface DiagramData {
    parties: readonly Party[];
    seatRadiusFactor: number;
    seatNumberFontSizeFactor: number;
    minNRows: number|null;
    fillingStrategy: FillingStrategy;
    spanAngle: number|null;
}

@Component({
    imports: [
        StandardPage, Contents,
        FormField,
        CdkDrag, CdkDragHandle, CdkDropList,
        MatButtonModule, MatFormFieldModule, MatDividerModule, MatInputModule,
        MatExpansionModule, MatSliderModule, MatButtonToggleModule, MatTooltipModule,
    ],
    templateUrl: './arch.html',
    styleUrl: './arch.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ArchPage {
    private readonly colorService = inject(ColorService);
    protected readonly reorderingService = inject(ReorderingService);

    protected readonly FillingStrategy = FillingStrategy;

    private readonly diagramModel = signal<DiagramData>({
        parties: [],
        seatRadiusFactor: .8,
        seatNumberFontSizeFactor: 1,
        minNRows: null,
        fillingStrategy: FillingStrategy.DEFAULT,
        spanAngle: null,
    });
    protected readonly diagramForm = form(this.diagramModel, schemaPath => {
        minLength(schemaPath.parties, 1);
        applyEach(schemaPath.parties, party => {
            min(party.nSeats, 0);
            min(party.borderWidth, 0);
            max(party.borderWidth, 1);
        });
        validate(schemaPath.parties, ({value}) => {
            const totalNSeats = value().reduce((a, p) => a+p.nSeats, 0);
            if (!totalNSeats) {
                return { kind: "minimum seats", message: "There must be at least one seat" };
            }
            return;
        });

        min(schemaPath.seatRadiusFactor, 0.0000000000000000000001);
        max(schemaPath.seatRadiusFactor, 1);

        min(schemaPath.seatNumberFontSizeFactor, 0);

        validate(schemaPath.minNRows, ({value}) => {
            const v = value();
            if (!(v == null || 0 <= v)) {
                return { kind: "bound", message: "The minimum number of rows cannot be less than 0" };
            }
            return;
        });

        // spanAngle null or (weird conditions)
    });

    protected readonly diagrams = signal<readonly SVGSVGElement[]>([]);

    protected addParty() {
        this.reorderingService.add(this.diagramForm.parties().value, this.newParty());
    }

    private newParty(): Party {
        return {
            name: "",
            nSeats: 0,
            color: this.colorService.randomColor(),
            borderWidth: 0,
            borderColor: "black",
        };
    }

    protected generateDiagram() {
        const value = this.diagramForm().value();
        const attrib = new Map(value.parties.map(fp => [{
            data: fp.name,
            color: fp.color,
            borderSize: fp.borderWidth,
            borderColor: fp.borderColor,
        }, fp.nSeats]));
        const options: Writeable<Parameters<typeof getSVGFromAttribution>[1]> = {
            seatRadiusFactor: value.seatRadiusFactor,
            seatNumberFontSizeFactor: value.seatNumberFontSizeFactor,
            fillingStrategy: value.fillingStrategy,
        };
        if (value.minNRows != null) {
            options.minNRows = value.minNRows;
        }
        if (value.spanAngle != null) {
            options.spanAngle = value.spanAngle;
        }

        const diagram = getSVGFromAttribution(attrib, options);
        this.diagrams.update(l => [ diagram ].concat(l));
    }

    protected readonly downloadDiagram = downloadDiagram;
}
