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

    public updatePreset(value: PresetModel): Observable<void> {
        const formData$ = from(this.loadImagesToFormData(value))
        return formData$.pipe(
            switchMap(x => this._client.put<void>(this._path, x)));
    }

    private async loadImagesToFormData(data: PresetModel): Promise<FormData> {
        const formData = new FormData();

        if (!data.general.hdld) {
            const generalImageResponse = await fetch(data.general.image);
            const generalImageBlob = await generalImageResponse.blob();
            const generalImageFile = new File([generalImageBlob], 'image.png', { type: 'image/png' });
            formData.append('image', generalImageFile);
        } else {
            const ldImageResponse = await fetch(data.general.ldImage);
            const ldImageBlob = await ldImageResponse.blob();
            const ldImageFile = new File([ldImageBlob], 'ldImage.png', { type: 'image/png' });
            formData.append('ldImage', ldImageFile);

            const hdImageResponse = await fetch(data.general.hdImage);
            const hdImageBlob = await hdImageResponse.blob();
            const hdImageFile = new File([hdImageBlob], 'hdImage.png', { type: 'image/png' });
            formData.append('hdImage', hdImageFile);
        }

        formData.append('json', JSON.stringify(data));

        return formData;
    }

    public getById(id: string) {
        return this._client.get<PresetModel>(this._path + '/' + id);
    }

    public delete(id: string) {
        return this._client.delete(this._path + '/' + id);
    }
}
