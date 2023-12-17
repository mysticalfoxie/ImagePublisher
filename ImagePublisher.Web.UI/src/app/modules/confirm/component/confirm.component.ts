import {Component, Inject, Input, ViewEncapsulation} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ConfirmDialogData} from "./confirm-dialog.data";

@Component({
    selector: 'app-confirm-component',
    templateUrl: 'confirm.component.html',
    styleUrls: ['confirm.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfirmComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: ConfirmDialogData) {
        if (!_data) return;
        this.title = _data.title;
        this.description = _data.description;
    }

    @Input() public title: string = "Confirm";
    @Input() public description: string = "Please confirm this action.";
}
