import {NgModule} from "@angular/core";
import {DAPresetEditorComponent} from "./components/deviantart/da-preset-editor.component";
import {EditorRoutingModule} from "./editor-routing.module";
import {EditorComponent} from "./editor.component";
import {EditorService} from "./editor.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MaterialModule} from "../../../modules/material.module";

@NgModule({
    declarations: [
        EditorComponent,
        DAPresetEditorComponent,
    ],
    imports: [EditorRoutingModule, MaterialModule],
    providers: [EditorService],
})
export class EditorModule {

}
