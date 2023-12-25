import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
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
        private _route: ActivatedRoute,
        private _confirmService: ConfirmService,
    ) {
        this._router.events
            .pipe(
                filter(x => x instanceof NavigationEnd),
                map(x => (x as NavigationEnd).url),
                tap(x => AppComponent.path$.next(x)),
                map(x => new RegExp("^\\/(\\w+)").exec(x as string)?.[1] || '/'))
            .subscribe(x => this.rootPath$.next(x as string));

        this.rootPath$
            .pipe(filter(x => x == '/'))
            .subscribe(async x => await this._router.navigate(['/', 'presets']))
    }

    public rootPath$ = new Subject<string>;
    public static readonly path$ = new BehaviorSubject<string>('');
}
