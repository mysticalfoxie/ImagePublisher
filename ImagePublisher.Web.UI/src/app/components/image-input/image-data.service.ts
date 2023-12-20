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
        this.url$.subscribe(async x => {
            if (!x) this.clearFileInformations();
        });
    }

    public readonly cancel$ = new Subject();
    public readonly url$ = new BehaviorSubject<string | null>(null);

    public ui: ImageInputComponent | undefined;
    public hasFileInfo: boolean = false;
    public filename: string | null = null;
    public filesize: string | null = null;
    public imageWidth: string | null = null;
    public imageHeight: string | null = null;
    public aspect: string | null = null;
    public loading: boolean = false;

    public async delete(): Promise<void> {
        if (!this.url$.value) return;

        // Set it to undefined BEFORE the Blob revocation to avoid a skip of the deletion because of assigned references
        const src = this.url$.value;
        this.url$.next(null);

        try {
            await this._dbService.deleteImage(src);
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
        if (this.url$.value)
            await this._dbService.deleteImage(this.url$.value);

        const image = await this._loaderService.loadImage(file);
        this.url$.next(image.blobUrl);
        await this._dbService.saveImage(image);
        await this.readFileInformations();
    }

    private async readFileInformations(): Promise<void> {
        if (!this.url$.value) return;
        const image = await this._dbService.getImage(this.url$.value);
        this.filename = image.filename;
        this.filesize = image.filesize;
        this.imageWidth = image.width;
        this.imageHeight = image.height;
        this.aspect = image.aspectRatio;
        this.hasFileInfo = true;
    }
}
