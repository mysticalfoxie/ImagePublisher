import {Route} from "@angular/router";
import {DAPresetEditorComponent} from "./components/da-preset-editor.component";

export const EditorRoutes: Route[] = [
    { path: 'new', component: DAPresetEditorComponent },
    { path: ':id', component: DAPresetEditorComponent },
    { path: '**', redirectTo: '/presets', pathMatch: 'full' }
]
