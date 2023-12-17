import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "./component/confirm.component";
import {firstValueFrom} from "rxjs";

@Injectable()
export class ConfirmService {
    constructor (private _dialogService: MatDialog) {

    }

    public async confirm(): Promise<boolean> {
        const closed$ = this._dialogService.open(ConfirmComponent, {
            autoFocus: 'first-tabbable',
            panelClass: 'app-confirm-dialog'
        }).afterClosed();

        return await firstValueFrom(closed$) === true;
    }
}
