import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {EditorDataService} from "./editor-data.service";
import {filter, from, map, Subject, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {EditorService} from "./editor.service";

@Component({
    selector: 'app-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit {
    public constructor(
        public service: EditorService,
        private _dataService: EditorDataService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this._dataService.load();
        this.subscribeCreateButton();
    }

    public async ngOnInit() {
        const id = this._route.snapshot.paramMap.get('id');
        if (!id) return;
        const regex = new RegExp("([\\w\\d]{8}-[\\w\\d]{4}-[\\w\\d]{4}-[\\w\\d]{4}-[\\w\\d]{12})$");
        if (regex.test(id))
            await this.service.loadModel(id);
    }

    public readonly create$ = new Subject();

    private subscribeCreateButton(): void {
        this.create$
            .pipe(
                map(() => this._dataService.getValue()),
                filter(x => !!x),
                switchMap(x => x!.id
                    ? from(this.service.updatePreset(x!))
                    : from(this.service.createPreset(x!))))
            .subscribe({
                next: async () => await this._router.navigate(['/', 'presets']),
                error: err => {
                    console.error(err);
                    this.subscribeCreateButton();
                }
            });
    }
}
