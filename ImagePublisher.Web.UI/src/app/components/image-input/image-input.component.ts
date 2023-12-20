import {
    AfterViewInit,
    Component,
    ElementRef,
    forwardRef,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {fromEvent, map} from "rxjs";
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
export class ImageInputComponent implements OnInit, AfterViewInit, ControlValueAccessor {
    public constructor(
        public service: ImageDataService,
        private _dbService: ImageDBService,
        private _dataService: ImageDataService
    ) {
        this.service.ui = this;
        this._dbService.ui = this;
        this.service.url$.subscribe(x => {
            this._onChange?.(x);
        });
    }

    public async ngOnInit(): Promise<void> {
        const url = await this._dbService.refreshBlobUrl();
        if (!url) return;
        this._dataService.url$.next(url);
        await this._dataService.readFileInformations();
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

    private _onChange: ((value: any) => void) | undefined;

    @Input() public title: string | undefined;
    @Input() public width: number = 512;
    @Input() public height: number = 512;
    @Input() public id: string | undefined;

    public dragAllowed: boolean = false;
    public dragDenied: boolean = false;

    @ViewChild('input')
    input: ElementRef<HTMLInputElement> | undefined;

    public writeValue(url: string): void {
        // Readonly
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

    public async clear(): Promise<void> {
        await this._dataService.delete();
    }

    public clearFilePicker(): void {
        if (!this.input?.nativeElement) return;

        // @ts-ignore
        this.input.nativeElement.value = null;
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
