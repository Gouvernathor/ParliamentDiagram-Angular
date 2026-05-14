import { Routes } from '@angular/router';
import { ArchInputFormPage } from './+arch-input-form/arch-input-form';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/archinputform",
        pathMatch: "full",
    },
    {
        path: "archinputform",
        component: ArchInputFormPage,
        title: "Arch-style parliament diagram generator",
    },
];
