import {Injectable} from "@angular/core";
import {HttpClientService} from "../services/httpClient.service";
import {PresetModel} from "../models/preset.model";
import {from, Observable, switchMap} from "rxjs";
import {PresetMetadataModel} from "../models/preset-metadata.model";

@Injectable()
export class PresetsController {
    private readonly _path = '/presets';

    public constructor(
        private _client: HttpClientService
    ) {

    }

    public getAll(): Observable<PresetMetadataModel[]> {
        return this._client.get<PresetMetadataModel[]>(this._path);
    }

    public createPreset(value: PresetModel): Observable<void> {
        const formData$ = from(this.loadImagesToFormData(value))
        return formData$.pipe(
            switchMap(x => this._client.post<void>(this._path, x)));
    }

    private async loadImagesToFormData(data: PresetModel): Promise<FormData> {
        const formData = new FormData();

        if (!data.general.hdld) {
            const generalImageResponse = await fetch(data.general.image);
            const generalImageBlob = await generalImageResponse.blob();
            formData.append('image', generalImageBlob);
        } else {
            const ldImageResponse = await fetch(data.general.ldImage);
            const ldImageBlob = await ldImageResponse.blob();
            formData.append('ldImage', ldImageBlob);

            const hdImageResponse = await fetch(data.general.hdImage);
            const hdImageBlob = await hdImageResponse.blob();
            formData.append('hdImage', hdImageBlob);
        }

        formData.append('json', JSON.stringify(data));

        return formData;
    }
}
