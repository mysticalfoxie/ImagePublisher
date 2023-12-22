import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {UploadService} from "./upload.service";
import {Router} from "@angular/router";
import {ActionBarService} from "./action-bar.service";
import {UploadDataService} from "./upload-data.service";
import {AppComponent} from "../../app.component";

@Component({
    selector: 'app-upload-component',
    templateUrl: 'upload.component.html',
    styleUrls: ['upload.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UploadComponent implements OnInit {
    public constructor(
        public actionBar: ActionBarService,
        private _service: UploadService,
        private _dataService: UploadDataService,
        private _router: Router
    ) {
        AppComponent.path$.subscribe(async x => {
            if (this._router.url != '/upload') return;
            if (this._service.preset$.value)
                await this._router.navigate(['/', 'upload', this._service.preset$.value.id]);
            else
                await this._router.navigate(['/', 'upload', 'select']);
        });
    }

    public async ngOnInit(): Promise<void> {
        this._dataService.load();
    }

}
