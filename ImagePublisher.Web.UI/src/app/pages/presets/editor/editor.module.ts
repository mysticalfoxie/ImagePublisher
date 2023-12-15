import {NgModule} from "@angular/core";
import {DAPresetEditorComponent} from "./components/da-preset-editor.component";
import {EditorRoutingModule} from "./editor-routing.module";

@NgModule({
    declarations: [DAPresetEditorComponent],
    imports: [EditorRoutingModule],
})
export class EditorModule {

}
