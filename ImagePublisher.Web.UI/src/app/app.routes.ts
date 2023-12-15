import {Routes} from "@angular/router";

export const AppRoutes: Routes = [
    {
        path: 'presets',
        loadChildren: () => import('./pages/presets/presets.module').then(x => x.PresetsModule)
    },
    {
        path: 'publish',
        loadChildren: () => import('./pages/publish/publish.module').then(x => x.PublishModule)
    },
    {
        path: '**',
        redirectTo: 'presets'
    }
]
