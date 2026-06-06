import { Routes } from '@angular/router';
import { ArchPage } from './+arch/arch';
import { WestminsterPage } from './+westminster/westminster';

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

    {
        path: "westminsterinputform",
        redirectTo: "/westminster",
    },
    {
        path: "westminster",
        component: WestminsterPage,
        title: "Westminster-style parliament diagram generator",
    },
];
