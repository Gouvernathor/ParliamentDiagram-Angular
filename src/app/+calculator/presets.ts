export interface Party {
    readonly name: string;
    readonly nSeats: number;
    readonly color: string;
}

export interface Preset {
    readonly name: string;
    readonly about?: string;
    readonly parties: readonly Party[];

    // maybe other general settings for the display of the arch (fillingStrategy…)
}

/**
 * Contributors can feel free to suggest updates or additions to this list of presets,
 * via an issue or pull request (on GitHub or Codeberg).
 */
export const presets: readonly Preset[] = [{
    name: "United States Senate",
    about: "This model preset can be used for american federal and state assemblies, as the parties are always the same.",
    parties: [{
        name: "Republican",
        color: "#f80000",
        nSeats: 50,
    }, {
        name: "Independent (caucusing with Republicans)",
        color: "#c66",
        nSeats: 0,
    }, {
        name: "Independent (caucusing with Democrats)",
        color: "#99f",
        nSeats: 0,
    }, {
        name: "Democrat",
        color: "#33f",
        nSeats: 50,
    }],
}, {
    name: "Assemblée Nationale (France)",
    about: "XVIIe législature, up to date as to 6 aug. 2026",
    parties: [{
        color: "#DD0000",
        name: "Gauche Démocrate et Républicaine",
        nSeats: 17,
    }, {
        color: "#CC2443",
        name: "La France Insoumise",
        nSeats: 71,
    }, {
        color: "#00C000",
        name: "Écologiste et Social",
        nSeats: 38,
    }, {
        color: "#FF8080",
        name: "Socialistes",
        nSeats: 68,
    }, {
        color: "#E1A5E1",
        name: "Libertés, Indépendants, Outre-mer et Territoires",
        nSeats: 23,
    }, {
        color: "#FF9900",
        name: "Les Démocrates",
        nSeats: 37,
    }, {
        color: "#FFEB00",
        name: "Ensemble pour la République",
        nSeats: 90,
    }, {
        color: "#0001B8",
        name: "Horizons",
        nSeats: 36,
    }, {
        color: "#0066CC",
        name: "Droite Républicaine",
        nSeats: 48,
    }, {
        color: "#162561",
        name: "Union des droites pour la République",
        nSeats: 17,
    }, {
        color: "#0D378A",
        name: "Rassemblement national",
        nSeats: 122,
    }, {
        color: "#DDDDDD",
        name: "Non-inscrits",
        nSeats: 10,
    }],
}];
