import {Component, ViewChild, ViewEncapsulation} from "@angular/core";
import {EditorDataService} from "../../editor-data.service";
import {ImageInputComponent} from "../../../../../components/image-input/image-input.component";

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
        this._dataService.form.clear$.subscribe(async () => {
            await this.hdImageInput?.clear();
            await this.ldImageInput?.clear();
            await this.imageInput?.clear();
        })
    }

    public get form() {
        return this._dataService.form.general;
    }

    @ViewChild('hdImage')
    public hdImageInput: ImageInputComponent | undefined;

    @ViewChild('ldImage')
    public ldImageInput: ImageInputComponent | undefined;

    @ViewChild('image')
    public imageInput: ImageInputComponent | undefined;


    public titleFocused: boolean = false;
    public descriptionFocused: boolean = false;
    public tagsFocused: boolean = false;
}
