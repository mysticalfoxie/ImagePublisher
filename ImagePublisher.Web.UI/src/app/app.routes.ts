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
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then(x => x.SettingsModule)
    },
    {
        path: '**',
        redirectTo: 'presets'
    }
]
