import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {PresetMetadataModel} from "../../models/preset-metadata.model";
import {UploadButtons} from "./upload.buttons";

@Injectable()
export class UploadService {
    public readonly preset$ = new BehaviorSubject<PresetMetadataModel | null>(null);
}
