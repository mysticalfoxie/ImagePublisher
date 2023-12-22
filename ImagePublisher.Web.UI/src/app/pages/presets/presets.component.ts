import {Component, ViewEncapsulation} from "@angular/core";
import {filter, from, map, Subject, switchMap} from "rxjs";
import {ConfirmService} from "../../modules/confirm/confirm.service";
import {PresetsService} from "./presets.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-presets-component',
    templateUrl: 'presets.component.html',
    styleUrls: ['presets.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [PresetsService]
})
export class PresetsComponent {
    constructor (
        public service: PresetsService,
        private _confirmService: ConfirmService,
        private _router: Router
    ) {
        this.subscribeDelete();
        this.subscribeEdit();
        this.service.loadPresets();
    }

    public displayedColumns: string[] = [ 'image', 'title', 'description', 'tags', 'timestamp', 'actions' ];

    public edit$ = new Subject<string>();
    public delete$ = new Subject<string>();
    public upload$ = new Subject<string>();

    public sanitizeUTCDate(dateString: string) {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };

        const locale = navigator?.languages?.length ? navigator.languages[0] : navigator.language;
        return date.toLocaleTimeString(locale, options);
    }

    public subscribeDelete(): void {
        this.delete$
            .pipe(
                switchMap(x => from(this._confirmService.confirm()).pipe(map(y => ({ confirmed: y, id: x })))),
                filter(x => x.confirmed),
                switchMap(x => this.service.delete(x.id as string)))
            .subscribe({
                next: () => {},
                error: err => {
                    console.error(err);
                    this.subscribeDelete();
                }
            });
    }

    public subscribeEdit(): void {
        this.edit$
            .pipe(switchMap(x => from(this._router.navigate(['/', 'presets', x]))))
            .subscribe({
                next: () => {},
                error: err => {
                    console.error(err);
                    this.subscribeEdit();
                }
            });
    }
}
