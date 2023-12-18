import {Component, ViewEncapsulation} from "@angular/core";

@Component({
    selector: 'app-general-preset-editor',
    templateUrl: "general-preset-editor.component.html",
    styleUrls: ["general-preset-editor.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class GeneralPresetEditorComponent {
    public titleFocused: boolean = false;
    public descriptionFocused: boolean = false;
    public tagsFocused: boolean = false;
}
