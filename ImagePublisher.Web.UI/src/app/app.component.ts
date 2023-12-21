import {AfterViewInit, Component} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter, map, Subject} from "rxjs";
import {ConfirmService} from "./modules/confirm/confirm.service";
import {environment} from "./environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private _router: Router,
        private _confirmService: ConfirmService,
    ) {
        this._router.events
            .pipe(
                filter(x => x instanceof NavigationEnd),
                map(x => (x as NavigationEnd).url),
                map(x => new RegExp("^\\/(\\w+)").exec(x as string)?.[1]),
                filter(x => !!x))
            .subscribe(x => this.path$.next(x as string));
    }

    public path$ = new Subject<string>;
}
