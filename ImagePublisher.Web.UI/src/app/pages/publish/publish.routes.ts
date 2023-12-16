import {Route} from "@angular/router";
import {PublishComponent} from "./publish.component";

export const PublishRoutes: Route[] = [
    { path: '', component: PublishComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
