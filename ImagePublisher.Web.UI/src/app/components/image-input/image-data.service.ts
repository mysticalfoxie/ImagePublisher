import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {ImageInputComponent} from "./image-input.component";
import {ImageDBService} from "./image-db.service";
import {ImageLoaderService} from "./image-loader.service";

@Injectable()
export class ImageDataService {
    public constructor(
        private _dbService: ImageDBService,
        private _loaderService: ImageLoaderService
    ) {
        this.url$.subscribe(x => {
            if (!x) this.clearFileInformations();
        });
    }

    public readonly cancel$ = new Subject();
    public readonly url$ = new BehaviorSubject<string | null>(null);

    public ui: ImageInputComponent | undefined;
    public hasFileInfo: boolean = false;
    public filename: string | null = null;
    public filesize: string | null = null;
    public imageWidth: number | null = null;
    public imageHeight: number | null = null;
    public aspect: string | null = null;
    public loading: boolean = false;


    public delete(): void {
        if (!this.url$) return;

        // Set it to undefined BEFORE the Blob revocation to avoid a skip of the deletion because of assigned references
        const src = this.url$.value;
        this.url$.next(null);

        try {
            URL.revokeObjectURL(src!)
        } catch {
        }
    }

    public clearFileInformations() {
        this.hasFileInfo = false;
        this.filename = null;
        this.filesize = null;
        this.imageWidth = null;
        this.imageHeight = null;
        this.aspect = null;
    }

    public async onFileChange(file: File): Promise<void> {
        const image = await this._loaderService.loadImage(file);
        await this._dbService.saveImage(image);
    }
}
