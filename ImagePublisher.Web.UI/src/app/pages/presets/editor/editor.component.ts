import {Component, ViewEncapsulation} from "@angular/core";
import {EditorDataService} from "./editor-data.service";

@Component({
    selector: 'app-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditorComponent {
    public constructor(
        private _dataService: EditorDataService
    ) {
        this._dataService.load();
    }
}
