import {Component, forwardRef, Input} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {BehaviorSubject} from "rxjs";

@Component({
    selector: 'app-label-input',
    templateUrl: 'label-input.component.html',
    styleUrls: ['label-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LabelInputComponent),
            multi: true
        }
    ]
})
export class LabelInputComponent implements ControlValueAccessor {
    public constructor() {
        this.value$.subscribe(() => {
            const value = this.value$.value;
            this._onChanged?.(value);
        })
    }

    public readonly value$ = new BehaviorSubject<string | null | undefined>(undefined);

    @Input() public icon: string | undefined;
    @Input() public label: string | undefined;
    @Input() public placeholder: string | undefined;
    @Input() public isTextarea: boolean = false;
    @Input() public textAreaMinRows: number | undefined;
    @Input() public textAreaMaxRows: number | undefined;

    public disabled: boolean = false;

    private _onChanged: ((value: string | null | undefined) => void) | undefined;
    private _onTouched: (() => void) | undefined;
    private _touched: boolean = false;
    private _focused: boolean = false;
    public get focused(): boolean {
        return this._focused;
    }

    public set focused(value: boolean) {
        if (value && !this._touched) {
            this._touched = true;
            this._onTouched?.();
        }

        this._focused = value;
    }

    public registerOnChange(fn: (value: string | null | undefined) => void): void {
        this._onChanged = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    public writeValue(value: string | null): void {
        this.value$.next(value);
    }

    public setDisabledState(value: boolean) {
        this.disabled = value;
    }
}
