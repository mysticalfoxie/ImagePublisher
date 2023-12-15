import {Route} from "@angular/router";
import {PresetsComponent} from "./presets.component";

export const PresetsRoutes: Route[] = [
    { path: '', component: PresetsComponent },
    { path: ':id', loadChildren: () => import('./editor/editor.module').then(x => x.EditorModule) },
    { path: 'new', loadChildren: () => import('./editor/editor.module').then(x => x.EditorModule) },
    { path: '**', redirectTo: '', pathMatch: 'full' },
    // { path: 'create', loadChildren: () => import('./create/create.module').then(x => x.CreateModule) },
]
