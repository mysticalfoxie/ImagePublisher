import {Route} from "@angular/router";
import {PresetsComponent} from "./presets.component";

export const PresetsRoutes: Route[] = [
    { path: '', component: PresetsComponent },
    { path: ':id', loadChildren: () => import('./editor/editor.module').then(x => x.EditorModule) },
    { path: 'new', loadChildren: () => import('./editor/editor.module').then(x => x.EditorModule) },
    { path: 'history', loadChildren: () => import('./history/history.module').then(x => x.HistoryModule) },
    { path: '**', redirectTo: '', pathMatch: 'full' },
]
