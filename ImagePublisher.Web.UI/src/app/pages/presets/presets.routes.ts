import {Route} from "@angular/router";

export const PresetsRoutes: Route[] = [
    {
        path: 'create',
        loadChildren: () => import('./create/create.module').then(x => x.CreateModule)
    }
]
