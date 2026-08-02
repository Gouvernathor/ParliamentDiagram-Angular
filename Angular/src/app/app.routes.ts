import { Routes } from '@angular/router';
import { ArchPage } from './+arch/arch';
import { WestminsterPage } from './+westminster/westminster';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/arch",
        pathMatch: "full",
    },
    // index
    // index.php

    // parliamentinputform.html
    // parlitest.php
    // archinputform.php
    {
        path: "archinputform",
        redirectTo: "/arch",
        pathMatch: "full",
    },
    {
        path: "arch",
        component: ArchPage,
        title: "Arch-style parliament diagram generator",
        resolve: ArchPage.resolve,
    },

    // USinputform.html
    // USinputform.php
    // USinputform
    {
        path: "usinputform",
        redirectTo: "/arch?preset=us",
        pathMatch: "full",
    },

    // westminsterinputform.html
    // westminsterinputform.php
    {
        path: "westminsterinputform",
        redirectTo: "/westminster",
        pathMatch: "full",
    },
    {
        path: "westminster",
        component: WestminsterPage,
        title: "Westminster-style parliament diagram generator",
    },

    // POST newarch, newarch.py, westminster and westminster.py : backend API
];
