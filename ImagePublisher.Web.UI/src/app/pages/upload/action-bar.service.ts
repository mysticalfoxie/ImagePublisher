import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {UploadButtons} from "./upload.buttons";

@Injectable()
export class ActionBarService {
    public constructor() {
        this.buttons$.subscribe(x => this.onButtonsChange(x));
    }

    private _buttonsO: UploadButtons | null = null;
    public readonly buttons$ = new BehaviorSubject<UploadButtons>(UploadButtons.None);
    public readonly subject$ = new BehaviorSubject<string>('');

    public readonly showSelectConfirmButton$ = new BehaviorSubject<boolean>(false);
    public readonly selectConfirmButtonDisabled$ = new BehaviorSubject<boolean>(false);
    public readonly selectConfirmButtonClicked$ = new Subject();

    public readonly showStartUploadButton$ = new BehaviorSubject<boolean>(false);
    public readonly startUploadButtonDisabled$ = new BehaviorSubject<boolean>(false);
    public readonly startUploadButtonClicked$ = new Subject();


    public disableButtons(): void {
        this.setDisabledState(true);
    }

    public enableButtons(): void {
        this.setDisabledState(false);
    }

    public setSubject(value: string): void {
        setTimeout(() => {
            this.subject$.next(value);
        });
    }

    private setDisabledState(state: boolean) {
        switch (this.buttons$.value) {
            case UploadButtons.SelectButton:
                this.selectConfirmButtonDisabled$.next(state);
                break;

            case UploadButtons.StartButton:
                this.startUploadButtonDisabled$.next(state);
                break;
        }
    }

    private setVisibleState(state: boolean, buttons: UploadButtons | null = null) {
        switch (buttons || this.buttons$.value) {
            case UploadButtons.SelectButton:
                this.showSelectConfirmButton$.next(state);
                break;

            case UploadButtons.StartButton:
                this.showStartUploadButton$.next(state);
                break;
        }
    }

    private onButtonsChange(newButtons: UploadButtons) {
        if (this._buttonsO)
            this.setVisibleState(false, this._buttonsO);

        this.setVisibleState(true, newButtons);
        this._buttonsO = newButtons;
    }
}
