import {AfterViewInit, Component, ElementRef, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {
    BehaviorSubject,
    catchError,
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
            if (!x)
                this.clearFileInformations();
            else
                this.readFileInformations();
        })
    }

    private clearFileInformations() {
        this.hasFileInfo = false;
        this.filename = null;
        this.filesize = null;
        this.aspect = null;
    }

    private formatFileSize(size: number): string {
        const kilobytes = size / 1024;
        if (kilobytes < 1024)
            return `${kilobytes.toFixed(2)} KB`;

        const megabytes = kilobytes / 1024;
        return `${megabytes.toFixed(2)} MB`;
    }

    private readFileInformations() {
        if (!this.input?.nativeElement.files?.length) return;
        if (!this.img?.nativeElement) return;

        const file = this.input.nativeElement.files.item(0)!;
        this.filename = file.name;
        this.filesize = this.formatFileSize(file.size);
        this.aspect = this.getAspectRatio();
        this.hasFileInfo = true;
    }

    private gcd(a: number, b: number): number {
        return b == 0 ? a : this.gcd(b, a % b);
    }

    private getAspectRatio(): string {
        const width = this.img!.nativeElement.width;
        const height = this.img!.nativeElement.height;
        const divisor = this.gcd(width, height);
        return `${width / divisor}:${height / divisor}`;
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
        fromEvent(this.input?.nativeElement!, 'drop').subscribe(() => this.resetDrag());
        fromEvent(this.input?.nativeElement!, 'change').subscribe(x => this.onFileChange());
    }

    public readonly src$ = new BehaviorSubject<string | null>(null);

    @Input() public set src(value: string) {
        this.src$.next(value);
    }

    @Input() public title: string | undefined;
    @Input() public width: number = 512;
    @Input() public height: number = 512;

    public hasFileInfo: boolean = false;
    public filename: string | null = null;
    public filesize: string | null = null;
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
        const promise = new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = e => {
                const result = e.target!.result as string;
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

    private resetDrag(): void {
        this.dragAllowed = false;
        this.dragDenied = false;
    }
}
