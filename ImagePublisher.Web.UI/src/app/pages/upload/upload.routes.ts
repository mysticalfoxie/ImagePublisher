import {Route} from "@angular/router";
import {UploadComponent} from "./upload.component";

export const UploadRoutes: Route[] = [
    { path: '', component: UploadComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
