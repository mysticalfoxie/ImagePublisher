import {Injectable} from "@angular/core";
import {filter} from "rxjs";
import {PresetModel} from "../../../models/preset.model";
import {EditorForm} from "./forms/editor.form";

@Injectable()
export class EditorDataService {
    constructor() {
        this.form = new EditorForm();
        this.form.data$
            .pipe(filter(() => this._loaded))
            .subscribe(x => this.save(x));
    }

    public form: EditorForm;
    private _loaded: boolean = false;

    private save(model: PresetModel | null): void {
        if (!model) {
            localStorage.removeItem('editor');
            return;
        }

        const json = JSON.stringify(model);
        localStorage.setItem('editor', json);
    }

    public load(): void {
        this._loaded = true;
        const item = localStorage.getItem('editor');
        if (!item) {
            this.form.initialize();
            return;
        }

        const model: PresetModel = JSON.parse(item);
        this.form.initialize(model);
        this.form.data$.next(model);
    }

    public getValue(): PresetModel | null {
        return this.form.data$.value;
    }
}
