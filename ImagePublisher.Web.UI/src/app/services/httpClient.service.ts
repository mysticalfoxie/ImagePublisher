import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {environment} from "../environments/environment";

@Injectable()
export class HttpClientService {
    public constructor(
        private _client: HttpClient
    ) {
    }

    public get<T>(path: string): Observable<T> {
        const url = this.getUrlForPath(path);
        return this._client
            .get(url)
            .pipe(map(x => x as T));
    }

    public post<T>(path: string, data: any): Observable<T> {
        const url = this.getUrlForPath(path);
        return this._client
            .post(url, data)
            .pipe(map(x => x as T));
    }

    public put<T>(path: string, data: any): Observable<T> {
        const url = this.getUrlForPath(path);
        return this._client
            .put(url, data)
            .pipe(map(x => x as T));
    }

    public delete(path: string): Observable<void> {
        const url = this.getUrlForPath(path);
        return this._client
            .delete(url)
            .pipe(map(() => {}));
    }

    private getUrlForPath(path: string): string {
        const base = environment.baseUrl.endsWith('/') ? environment.baseUrl.slice(0, environment.baseUrl.length - 2) : environment.baseUrl;
        const newPath = path.startsWith('/') ? path.slice(1, path.length - 1) : path;
        return base + newPath;
    }
}
