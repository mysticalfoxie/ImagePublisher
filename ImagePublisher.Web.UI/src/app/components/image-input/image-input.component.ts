import {AfterViewInit, Component, ElementRef, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {
    BehaviorSubject,
    catchError, filter,
    from,
    fromEvent,
    map,
    Observable,
    Subject,
    Subscription,
    take,
    throwError
} from "rxjs";

@Component({
    selector: 'app-image-input',
    templateUrl: 'image-input.component.html',
    styleUrls: ['image-input.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ImageInputComponent implements AfterViewInit {
    constructor() {
        this.src$.subscribe(x => {
            if (!x) this.clearFileInformations();
        });
    }

    public ngAfterViewInit(): void {
        fromEvent(this.input?.nativeElement!, 'dragenter')
            .pipe(map(x => x as DragEvent))
            .subscribe((x: any) => {
                const type = x.dataTransfer?.items?.[0]?.type;
                if (type?.startsWith('image'))
                    this.dragAllowed = true;
                else
                    this.dragDenied = true;
            });

        fromEvent(this.input?.nativeElement!, 'dragleave').subscribe(() => this.resetDrag());
        fromEvent(this.input?.nativeElement!, 'drop').subscribe(x => this.resetDrag());
        fromEvent(this.input?.nativeElement!, 'change').subscribe(() => this.onFileChange());
    }

    public readonly src$ = new BehaviorSubject<string | null>(null);

    private _srcLocked = false;
    private _src: string | undefined;

    public get src(): string | undefined {
        return this._src;
    }

    @Input()
    public set src(value: string) {
        if (this._srcLocked) return;
        this._srcLocked = true;
        this._src = value;
        this.loadImageFromFilepath(value)
            .finally(() => this._srcLocked = false);
    }

    @Input() public title: string | undefined;
    @Input() public width: number = 512;
    @Input() public height: number = 512;

    public hasFileInfo: boolean = false;
    public filename: string | null = null;
    public filesize: string | null = null;
    public imageWidth: number | null = null;
    public imageHeight: number | null = null;
    public aspect: string | null = null;

    public dragAllowed: boolean = false;
    public dragDenied: boolean = false;
    public loading: boolean = false;
    public cancel$ = new Subject();

    @ViewChild('input') private input: ElementRef<HTMLInputElement> | undefined;
    @ViewChild('img') private img: ElementRef<HTMLImageElement> | undefined;

    private onFileChange(): void {
        const file = this.input!.nativeElement.files![0];
        if (!file) return;
        const src$ = this.loadImageToBlob(file);
        src$
            .pipe(take(1))
            .subscribe({
                next: src => this.src$.next(src),
                error: (err) => {
                    this.loading = false
                    console.error(err);
                }
            });
    }

    public delete(): void {
        if (!this.src$) return;

        // Set it to undefined BEFORE the Blob revocation to avoid a skip of the deletion because of assigned references
        const src = this.src$.value;
        this.src$.next(null);

        if (src?.startsWith('data:'))
            try {
                URL.revokeObjectURL(this.src$.value!)
            } catch {
            }
    }

    private loadImageToBlob(file: File): Observable<string> {
        let subscription: Subscription;
        const promise = new Promise<string>(async (resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async e => {
                const result = e.target!.result as string;
                await this.readFileInformations(result);

                this.loading = false;
                resolve(result);
            }

            subscription = this.cancel$.subscribe(() => {
                reader.abort();
                reject(new Error("The reading has been cancelled."));
            });

            this.loading = true;
            reader.readAsDataURL(file);
        });

        return from(promise)
            .pipe(catchError((err) => {
                subscription?.unsubscribe();
                this.loading = false;
                return throwError(() => err);
            }));
    }

    private clearFileInformations() {
        this.hasFileInfo = false;
        this.filename = null;
        this.filesize = null;
        this.imageWidth = null;
        this.imageHeight = null;
        this.aspect = null;
    }

    private formatFileSize(size: number): string {
        const kilobytes = size / 1024;
        if (kilobytes < 1024)
            return `${kilobytes.toFixed(2)} KB`;

        const megabytes = kilobytes / 1024;
        return `${megabytes.toFixed(2)} MB`;
    }

    private async readFileInformations(imageBuffer: string, blob: Blob | null = null): Promise<void> {
        const image = await this.loadPseudoImage(imageBuffer);

        if (this.input?.nativeElement.files?.length) {
            const file = this.input.nativeElement.files.item(0)!;
            this.filename = file.name;
            this.filesize = this.formatFileSize(file.size);
        }

        if (blob) {
            this.filename = this.getFilenameByPath(this._src);
            this.filesize = this.formatFileSize(blob.size);
        }

        this.readFileInformationsFromImage(image);

        this.hasFileInfo = true;
    }

    private getFilenameByPath(path: string | undefined): string | null {
        if (!path) return null;
        const regex = new RegExp(".*\\/(.*\\.\\w+)");
        return regex.exec(path)?.[1] || null;
    }

    private readFileInformationsFromImage(image: HTMLImageElement): void {
        this.imageHeight = image.height;
        this.imageWidth = image.width;
        this.aspect = this.calculateAspectRatio(image);
    }

    private gcd(a: number, b: number): number {
        return b == 0 ? a : this.gcd(b, a % b);
    }

    private loadPseudoImage(imageBuffer: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = err => reject(err);
            image.src = imageBuffer;
        });
    }

    private calculateAspectRatio(image: HTMLImageElement): string {
        const divisor = this.gcd(image.width, image.height);
        return `${image.width / divisor}:${image.height / divisor}`;
    }

    private resetDrag(): void {
        this.dragAllowed = false;
        this.dragDenied = false;
    }

    private async loadImageFromFilepath(filepath: string): Promise<void> {
        const response = await fetch(filepath);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        await this.readFileInformations(url, blob);
        this.src$.next(url);
    }
}
