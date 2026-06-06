import { Routes } from '@angular/router';
import { ArchPage } from './+arch/arch';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/arch",
        pathMatch: "full",
    },
    {
        path: "archinputform",
        redirectTo: "/arch",
    },
    {
        path: "arch",
        component: ArchPage,
        title: "Arch-style parliament diagram generator",
    },
];
