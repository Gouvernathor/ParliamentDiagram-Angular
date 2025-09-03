import { Routes } from '@angular/router';
import { Archinputform } from './archinputform/archinputform';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/archinputform",
        pathMatch: "full",
    },
    {
        path: "archinputform",
        component: Archinputform,
        title: "Arch-style parliament diagram generator",
    },
];
