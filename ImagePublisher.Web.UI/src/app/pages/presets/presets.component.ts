import {Component, ViewEncapsulation} from "@angular/core";
import {filter, from, Subject, switchMap} from "rxjs";
import {ConfirmService} from "../../modules/confirm/confirm.service";
import {PresetsService} from "./presets.service";

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
    ) {
        this.subscribeDelete();
        this.service.loadPresets();
    }

    public displayedColumns: string[] = [ 'image', 'title', 'description', 'tags', 'timestamp', 'actions' ];

    public edit$ = new Subject<number>();
    public delete$ = new Subject<number>();
    public upload$ = new Subject<number>();

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
                switchMap(() => from(this._confirmService.confirm())),
                filter(x => !!x))
            .subscribe({
                next: () => console.log('debug'),
                error: err => {
                    console.error(err);
                    this.subscribeDelete();
                }
            })
    }
}
