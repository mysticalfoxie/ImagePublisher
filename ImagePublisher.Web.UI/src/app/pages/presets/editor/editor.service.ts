import {Injectable} from "@angular/core";
import {EditorDataService} from "./editor-data.service";
import {PresetsController} from "../../../controllers/presets.controller";
import {PresetModel} from "../../../models/preset.model";
import {firstValueFrom} from "rxjs";

@Injectable()
export class EditorService {
    public constructor(
        private _dataService: EditorDataService,
        private _controller: PresetsController
    ) {

    }

    public async createPreset(data: PresetModel): Promise<void> {
        const request$ = this._controller.createPreset(data);
        await firstValueFrom(request$);
        this.clear();
    }

    public async updatePreset(data: PresetModel): Promise<void> {
        const request$ = this._controller.updatePreset(data);
        await firstValueFrom(request$);
        this.clear();
    }

    public clear() {
        this._dataService.form.clear();
    }

    public async loadModel(id: string): Promise<void> {
        const request$ = this._controller.getById(id);
        const model = await firstValueFrom(request$);
        this._dataService.form.initialize(model);
        this._dataService.form.imageLoad$.next(model);
        //this._dataService.setLocalEditMode(true);
    }
}

