import {Injectable} from "@angular/core";
import {HttpClientService} from "../services/httpClient.service";
import {EditorModel} from "../models/editor.model";
import {Observable} from "rxjs";

@Injectable()
export class PresetsController {
    private readonly _path = '/presets';

    public constructor(
        private _client: HttpClientService
    ) {

    }

    public createPreset(value: EditorModel): Observable<void> {
        return this._client.post<void>(this._path, value);
    }
}
