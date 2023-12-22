import {Component} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject, filter, map, Subject, tap} from "rxjs";
import {ConfirmService} from "./modules/confirm/confirm.service";

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
                tap(x => AppComponent.path$.next(x)),
                map(x => new RegExp("^\\/(\\w+)").exec(x as string)?.[1]),
                filter(x => !!x))
            .subscribe(x => this.rootPath$.next(x as string));
    }

    public rootPath$ = new Subject<string>;
    public static readonly path$ = new BehaviorSubject<string>('');
}
