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
        });

        this._dataService.form.imageLoad$.subscribe(x => {
            if (!x?.general || !this.hdImageInput || !this.ldImageInput || !this.imageInput) return;
            if (x.general.hdld) {
                if (x.general.hdImage)
                    this.hdImageInput?.loadFromImageUrl(x?.general.hdImage);
                if (x.general.ldImage)
                    this.ldImageInput?.loadFromImageUrl(x?.general.ldImage);
            } else {
                if (x.general.image)
                    this.imageInput?.loadFromImageUrl(x?.general.image);
            }
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
