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
        public service: EditorDataService
    ) {
        this.service.load();
    }
}
