import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    OnInit,
    signal,
} from "@angular/core";
import { applyEach, form, FormField, max, min, minLength, validate } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FillingStrategy } from "@parliamentarch/core/geometry";
import { getSVGFromAttribution } from "@parliamentarch/svg";
import { ColorService } from "../shared/color.service";
import { DiagramsList } from "../shared/diagrams-list/diagrams-list";
import { FileDrop } from "../shared/file-drop/file-drop";
import { ExtractDiagram } from "../shared/file-drop/extract-diagram.js";
import { PartyList } from "../shared/party-list/party-list";
import { ReorderingService } from "../shared/reordering.service";
import { StandardPage } from "../shared/standard-page/standard-page";
import { Resolvers, Writeable } from "../shared/utils/types";
import { Diagram, WikipediaDiagramService } from "../shared/wikipedia-diagram.service";
import { SvgToPreset } from "./svg-to-preset.js";
import type { Party } from "./types.js";

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
        StandardPage, PartyList, DiagramsList, FileDrop, ExtractDiagram,
        FormField,
        MatButtonModule, MatFormFieldModule, MatDividerModule, MatInputModule,
        MatExpansionModule, MatSliderModule, MatButtonToggleModule, MatTooltipModule,
    ],
    templateUrl: "./arch.html",
    styleUrl: "./arch.scss",
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class ArchPage implements OnInit {
    private readonly colorService = inject(ColorService);
    protected readonly reorderingService = inject(ReorderingService);
    private readonly snackbar = inject(MatSnackBar);
    private readonly wikipediaDiagramService = inject(WikipediaDiagramService);
    protected readonly svgToPresetService = inject(SvgToPreset);

    protected readonly FillingStrategy = FillingStrategy;

    readonly preset = input<string|null>(null);

    static readonly resolve: Resolvers<ArchPage> = {
        preset: route => route.queryParamMap.get("preset"),
    };

    async ngOnInit() {
        switch (this.preset()?.toLowerCase()) {
            case null:
            case undefined:
                break;

            case "us":
                this.applyUSPreset();
                break;

            default:
                this.snackbar.open("Unknown preset name", undefined, {
                    duration: 5000,
                    horizontalPosition: "right",
                });
                break;
        }
    }

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
        validate(schemaPath.parties, ({ value }) => {
            const totalNSeats = value().reduce((a, p) => a+p.nSeats, 0);
            if (!totalNSeats) {
                return { kind: "minimum seats", message: "There must be at least one seat" };
            }
            return;
        });

        min(schemaPath.seatRadiusFactor, .01);
        max(schemaPath.seatRadiusFactor, 1);

        min(schemaPath.seatNumberFontSizeFactor, 0);

        validate(schemaPath.minNRows, ({ value }) => {
            const v = value();
            if (!(v == null || 0 <= v)) {
                return {
                    kind: "bound",
                    message: "The minimum number of rows cannot be less than 0",
                };
            }
            return;
        });

        // spanAngle null or (weird conditions)
    });

    protected readonly diagrams = signal<readonly Diagram[]>([]);

    protected applyPreset(preset: readonly Party[]) {
        this.diagramForm.parties().value.set(preset);
    }
    protected applyUSPreset() {
        this.applyPreset(this.newUSPreset());
    }

    private newUSPreset() {
        const newParty = this.newParty();
        return [
            { ...newParty, name: "Republican", color: "#f80000", nSeats: 50 },
            { ...newParty, name: "Independent", color: "#c66" },
            { ...newParty, name: "Vacant", color: "#fff", borderWidth: .2 },
            { ...newParty, name: "Independent", color: "#99f" },
            { ...newParty, name: "Democratic", color: "#33f", nSeats: 50 },
        ];
    }

    protected newParty(): Party {
        return {
            name: "",
            nSeats: 0,
            color: this.colorService.randomColor(),
            borderWidth: 0,
            borderColor: "black",
        };
    }

    /* private savePreset() {
        downloadJson(this.diagramForm.parties().value());
    } */

    protected generateDiagram() {
        const value = this.diagramForm().value();
        const attrib = new Map(
            value.parties.map(fp => [
                {
                    data: fp.name,
                    color: fp.color,
                    borderSize: fp.borderWidth,
                    borderColor: fp.borderColor,
                },
                fp.nSeats,
            ]),
        );
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
        this.diagrams.update(l => [
            {
                svg: diagram,
                legend: this.wikipediaDiagramService.getLegend(value.parties),
            },
            ...l,
        ]);
    }
}
