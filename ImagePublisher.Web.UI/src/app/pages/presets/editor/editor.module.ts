import {NgModule} from "@angular/core";
import {DAPresetEditorComponent} from "./components/deviantart/da-preset-editor.component";
import {EditorRoutingModule} from "./editor-routing.module";
import {EditorComponent} from "./editor.component";
import {EditorDataService} from "./editor-data.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MaterialModule} from "../../../modules/material.module";
import {GeneralPresetEditorComponent} from "./components/general/general-preset-editor.component";
import {AppComponentsModule} from "../../../modules/components.module";
import {CommonModule, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        EditorComponent,
        GeneralPresetEditorComponent,
        DAPresetEditorComponent,
    ],
    imports: [
        EditorRoutingModule,
        CommonModule,
        MaterialModule,
        AppComponentsModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [EditorDataService],
})
export class EditorModule {

}
