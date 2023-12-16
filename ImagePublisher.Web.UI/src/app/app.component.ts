import { Component } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter, map, Subject} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public path$ = new Subject<string>;

    constructor(
        private _router: Router
    ) {
        this._router.events
            .pipe(
                filter(x => x instanceof NavigationEnd),
                map(x => (x as NavigationEnd).url),
                map(x => new RegExp("^\\/(\\w+)").exec(x as string)?.[1]),
                filter(x => !!x))
            .subscribe(x => this.path$.next(x as string));

        this.path$.subscribe(console.log)
    }
}
