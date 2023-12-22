import {Route} from "@angular/router";
import {UploadComponent} from "./upload.component";
import {SelectComponent} from "./components/select/select.component";
import {PublishComponent} from "./components/publish/publish.component";

export const UploadRoutes: Route[] = [
    {
        path: '',
        children: [
            { path: 'select', component: SelectComponent },
            { path: ':id', component: PublishComponent },
        ],
        component: UploadComponent
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
