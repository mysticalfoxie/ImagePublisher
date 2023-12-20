import {Component, ViewEncapsulation} from "@angular/core";
import {EditorDataService} from "./editor-data.service";
import {filter, from, map, Subject, switchMap} from "rxjs";
import {Router} from "@angular/router";
import {EditorService} from "./editor.service";

@Component({
    selector: 'app-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditorComponent {
    public constructor(
        public service: EditorService,
        private _dataService: EditorDataService,
        private _router: Router
    ) {
        this._dataService.load();
        this.subscribeCreateButton();
    }

    public readonly create$ = new Subject();

    private subscribeCreateButton(): void {
        this.create$
            .pipe(
                map(() => this._dataService.getValue()),
                filter(x => !!x),
                switchMap(x => from(this.service.createPreset(x!))))
            .subscribe({
                next: async () => await this._router.navigate(['/', 'presets']),
                error: err => {
                    console.error(err);
                    this.subscribeCreateButton();
                }
            });
    }
}
