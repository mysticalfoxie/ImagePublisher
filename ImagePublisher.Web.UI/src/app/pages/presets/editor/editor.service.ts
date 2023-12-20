import {Injectable} from "@angular/core";
import {EditorDataService} from "./editor-data.service";
import {PresetsController} from "../../../controllers/presets.controller";
import {EditorModel} from "../../../models/editor.model";
import {firstValueFrom} from "rxjs";

@Injectable()
export class EditorService {
    public constructor(
        private _dataService: EditorDataService,
        private _controller: PresetsController
    ) {

    }

    public async createPreset(data: EditorModel): Promise<void> {
        const request$ = this._controller.createPreset(data);
        await firstValueFrom(request$);
    }

    public clear() {
        this._dataService.form.clear();
    }
}

