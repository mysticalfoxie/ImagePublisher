import {Component, ViewEncapsulation} from "@angular/core";
import {EditorDataService} from "../../editor-data.service";

@Component({
    selector: 'app-general-preset-editor',
    templateUrl: "general-preset-editor.component.html",
    styleUrls: ["general-preset-editor.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class GeneralPresetEditorComponent {
    public constructor(
        private _dataService: EditorDataService,
    ) {
    }

    public get form() {
        return this._dataService.form.general;
    }

    public titleFocused: boolean = false;
    public descriptionFocused: boolean = false;
    public tagsFocused: boolean = false;
}
