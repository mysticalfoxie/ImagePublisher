import {Routes} from "@angular/router";

export const AppRoutes: Routes = [
    {
        path: 'presets',
        loadChildren: () => import('./pages/presets/presets.module').then(x => x.PresetsModule)
    },
    {
        path: 'upload',
        loadChildren: () => import('./pages/upload/upload.module').then(x => x.UploadModule)
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
