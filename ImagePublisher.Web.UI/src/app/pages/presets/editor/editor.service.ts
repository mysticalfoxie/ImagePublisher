import {Injectable} from "@angular/core";
import {EditorDataService} from "./editor-data.service";
import {PresetsController} from "../../../controllers/presets.controller";
import {EditorModel} from "../../../models/editor.model";
import {firstValueFrom} from "rxjs";
import {FormBuilder} from "@angular/forms";

@Injectable()
export class EditorService {
    public constructor(
        private _dataService: EditorDataService,
        private _controller: PresetsController
    ) {

    }

    private async getBlobFileByUrl(url: string): Promise<Blob> {
         const response = await fetch(url);
         return await response.blob();
    }

    public async createPreset(data: EditorModel): Promise<void> {
        const request$ = this._controller.createPreset(data);
        await firstValueFrom(request$);
    }

    public clear() {
        this._dataService.form.clear();
    }
}

