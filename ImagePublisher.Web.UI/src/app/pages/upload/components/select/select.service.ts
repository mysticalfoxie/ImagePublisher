import {Injectable} from "@angular/core";
import {PresetsController} from "../../../../controllers/presets.controller";
import {BehaviorSubject} from "rxjs";
import {PresetMetadataModel} from "../../../../models/preset-metadata.model";
import {UploadService} from "../../upload.service";

@Injectable()
export class SelectService {
    public constructor(
        private _controller: PresetsController,
        private _uploadService: UploadService,
    ) {
        this._controller
            .getAll()
            .subscribe(x => this.presets$.next(x));
    }

    public readonly presets$ = new BehaviorSubject<PresetMetadataModel[]>([]);
    public readonly selected$ = new BehaviorSubject<PresetMetadataModel | null>(null);

    public onConfirm(): void {
        this._uploadService.preset$.next(this.selected$.value);
    }
}
