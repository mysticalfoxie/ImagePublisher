import {Component, OnInit} from "@angular/core";
import {SelectService} from "./select.service";
import {PresetMetadataModel} from "../../../../models/preset-metadata.model";
import {UploadButtons} from "../../upload.buttons";
import {ActionBarService} from "../../action-bar.service";
import {map, skip} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector: 'app-select-component',
    templateUrl: 'select.component.html',
    styleUrls: ['select.component.scss'],
    providers: [SelectService]
})
export class SelectComponent {
    public constructor(
        public service: SelectService,
        private _actionBar: ActionBarService,
        private _router: Router,
    ) {
        this.service.selected$
            .pipe(map(x => !!x))
            .subscribe(hasValue => hasValue
                ? this._actionBar.enableButtons()
                : this._actionBar.disableButtons());

        this._actionBar.selectConfirmButtonClicked$
            .pipe(map(() => this.service.onConfirm()))
            .subscribe(async () =>
                await this._router.navigate(['/', 'upload' ]));

        setTimeout(() => {
            this._actionBar.subject$.next('Select a preset');
            this._actionBar.buttons$.next(UploadButtons.SelectButton);
            if (!this.service.selected$.value)
                this._actionBar.disableButtons();
        });
    }

    public onSelect(item: PresetMetadataModel) {
        const newSelection = this.service.selected$.value?.id == item?.id ? null : item;
        this.service.selected$.next(newSelection);
    }
}
