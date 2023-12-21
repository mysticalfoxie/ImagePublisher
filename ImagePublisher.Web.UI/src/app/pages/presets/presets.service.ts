import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
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
}
