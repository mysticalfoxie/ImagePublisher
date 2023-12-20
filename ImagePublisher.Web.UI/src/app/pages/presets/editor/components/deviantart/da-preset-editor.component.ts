import {Component, ViewEncapsulation} from "@angular/core";
import {EditorDataService} from "../../editor-data.service";
import {DAPresetForm} from "../../forms/da-preset.form";

@Component({
    selector: 'app-da-preset-editor',
    templateUrl: 'da-preset-editor.component.html',
    styleUrls: ['da-preset-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DAPresetEditorComponent {
    public constructor(
        private _editorService: EditorDataService,
    ) {

    }

    public get form(): DAPresetForm {
        return this._editorService.form.deviantart;
    }
}
