import {Injectable} from "@angular/core";
import {BehaviorSubject, filter} from "rxjs";
import {EditorModel} from "../../../models/editor.model";
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

    private save(model: EditorModel | null): void {
        if (!model) {
            sessionStorage.removeItem('editor');
            return;
        }

        const json = JSON.stringify(model);
        sessionStorage.setItem('editor', json);
    }

    public load(): void {
        this._loaded = true;
        const item = sessionStorage.getItem('editor');
        if (!item) {
            this.form.initialize();
            return;
        }

        const model: EditorModel = JSON.parse(item);
        this.form.initialize(model);
        this.form.data$.next(model);
    }
}
