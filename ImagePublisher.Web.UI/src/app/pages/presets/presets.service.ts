import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, switchMap, tap} from "rxjs";
import {PresetMetadataModel} from "../../models/preset-metadata.model";
import {PresetsController} from "../../controllers/presets.controller";

@Injectable()
export class PresetsService {

    public constructor(
        private _endpoint: PresetsController
    ) {

    }

    public readonly presets$ = new BehaviorSubject<PresetMetadataModel[]>([]);

    public loadPresets(): void {
        this._endpoint
            .getAll()
            .subscribe(x => this.presets$.next(x));
    }

    public delete(id: string): Observable<void> {
        return this._endpoint
            .delete(id)
            .pipe(tap(x => this.loadPresets()));
    }
}
