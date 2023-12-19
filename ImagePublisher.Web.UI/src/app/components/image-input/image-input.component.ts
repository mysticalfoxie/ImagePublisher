import {AfterViewInit, Component, ElementRef, forwardRef, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {from, fromEvent, map, tap} from "rxjs";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ImageDataService} from "./image-data.service";
import {ImageDBService} from "./image-db.service";
import {ImageLoaderService} from "./image-loader.service";

@Component({
    selector: 'app-image-input',
    templateUrl: 'image-input.component.html',
    styleUrls: ['image-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ImageDataService,
        ImageLoaderService,
        ImageDBService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ImageInputComponent),
            multi: true
        }
    ]
})
export class ImageInputComponent implements AfterViewInit, ControlValueAccessor {
    public constructor(
        public service: ImageDataService,
        private _dbService: ImageDBService,
        private _dataService: ImageDataService
    ) {
        this.service.ui = this;
        this.service.url$.subscribe(x => {
            this._onChange?.(x);
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
        fromEvent(this.input?.nativeElement!, 'drop').subscribe(() => this.resetDrag());
        fromEvent(this.input?.nativeElement!, 'change').subscribe(() => this.onFileChange());
    }

    private _src: string | undefined;
    private _srcLocked = false;
    private _onChange: ((value: any) => void) | undefined;

    public get src(): string | undefined {
        return this._src;
    }

    @Input()
    public set src(value: string) {
        if (this._srcLocked) return;

        this._srcLocked = true;
        from(this._dbService.refreshBlobUrl(value))
            .pipe(tap(() => this._srcLocked = false))
            .subscribe(x => this._dataService.url$.next(x));
    }

    @Input() public title: string | undefined;
    @Input() public width: number = 512;
    @Input() public height: number = 512;

    public dragAllowed: boolean = false;
    public dragDenied: boolean = false;

    @ViewChild('input')
    input: ElementRef<HTMLInputElement> | undefined;

    public writeValue(src: string): void {
        this.src = src;
    }

    public registerOnChange(fn: (value: string) => void): void {
        this._onChange = fn;
    }

    public registerOnTouched(_: any): void {
        // Not implemented
    }

    public setDisabledState?(_: boolean): void {
        // Not implemented.
    }

    private async onFileChange(): Promise<void> {
        const file = this.input!.nativeElement.files![0];
        if (!file) return;

        await this.service.onFileChange(file);
    }

    private resetDrag(): void {
        this.dragAllowed = false;
        this.dragDenied = false;
    }
}
