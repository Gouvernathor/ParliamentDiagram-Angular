import { Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { ArchPage } from './+arch/arch';
import { WestminsterPage } from './+westminster/westminster';
import { OauthCallbackPage } from './+oauth-callback/oauth-callback';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/arch",
        pathMatch: "full",
    },

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

    {
        path: "usinputform",
        redirectTo: "/arch?preset=us",
        pathMatch: "full",
    },

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

    {
        path: "oauth_callback",
        redirectTo: "/oauth-callback",
        pathMatch: "full",
    },
    {
        path: "oauth-callback",
        component: OauthCallbackPage,
        title: "OAuth callback",
        resolve: OauthCallbackPage.resolve,
    },
];

if (environment.legacyRoutes) {
    const l: [string, string[]][] = [
        ["", [
            "index",
            "index.php",
        ]],

        ["/arch", [
            "parliamentinputform.html",
            "parlitest.php",
            "archinputform.php",
        ]],

        ["/usinputform", [
            "USinputform.html",
            "USinputform.php",
            "USinputform",
        ]],

        ["/westminster", [
            "westminsterinputform.html",
            "westminsterinputform.php",
        ]],

        // POST newarch, newarch.py, westminster and westminster.py : no more backend
    ];

    routes.push(...l.flatMap(([to, paths]) => paths.map(path => ({
        path,
        redirectTo: to,
        pathMatch: "full" as const,
    }))));
}
