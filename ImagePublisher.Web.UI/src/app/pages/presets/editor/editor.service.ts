import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {EditorModel} from "../../../models/editor.model";

@Injectable()
export class EditorService {
    constructor() {
        this.data$.subscribe(x => this.save(x));
    }

    public data$ = new BehaviorSubject<EditorModel | null>(null);

    private save(model: EditorModel | null): void {
        if (!model) {
            sessionStorage.removeItem('editor');
            return;
        }

        const json = JSON.stringify(model);
        sessionStorage.setItem('editor', json);
    }

    public load(): void {
        const item = sessionStorage.getItem('editor');
        if (!item) return;

        const model: EditorModel = JSON.parse(item);
        this.data$.next(model);
    }
}
