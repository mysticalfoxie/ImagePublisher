import {Injectable} from "@angular/core";
import {UploadService} from "./upload.service";
import {PresetMetadataModel} from "../../models/preset-metadata.model";

@Injectable()
export class UploadDataService {
    public constructor(
        private _uploadService: UploadService
    ) {
        this._uploadService.preset$.subscribe(x => {
            this.save(x);
        });
    }

    private save(model: PresetMetadataModel | null) {
        if (!model) {
            localStorage.removeItem('upload-preset');
            return;
        }

        localStorage.setItem('upload-preset', JSON.stringify(model));
    }

    public load() {
        const item = localStorage.getItem('upload-preset');
        if (!item) return;

        const model = JSON.parse(item);
        this._uploadService.preset$.next(model as PresetMetadataModel);
    }

    public clear() {
        localStorage.removeItem('upload-preset');
    }
}
