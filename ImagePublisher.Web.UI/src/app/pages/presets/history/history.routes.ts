import {Route} from "@angular/router";
import {HistoryComponent} from "./history.component";

export const HistoryRoutes: Route[] = [
    { path: '', component: HistoryComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
]
