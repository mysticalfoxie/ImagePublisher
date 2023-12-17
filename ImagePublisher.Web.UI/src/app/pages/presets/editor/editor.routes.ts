import {Route} from "@angular/router";
import {EditorComponent} from "./editor.component";

export const EditorRoutes: Route[] = [
    { path: 'new', component: EditorComponent },
    { path: ':id', component: EditorComponent },
    { path: '**', redirectTo: '/presets', pathMatch: 'full' }
]
