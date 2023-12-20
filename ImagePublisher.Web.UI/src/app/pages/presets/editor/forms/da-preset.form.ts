import {FormControl, FormGroup} from "@angular/forms";

export class DAPresetForm extends FormGroup {
    public constructor() {
        super({
            title: new FormControl<string | null>({ value: '', disabled: true }),
            description: new FormControl<string | null>({ value: '', disabled: true }),
            tags: new FormControl<string | null>({ value: '', disabled: true }),
            character: new FormControl<string | null>(''),
            location: new FormControl<string | null>(''),
            custom_title: new FormControl<boolean>(false),
            custom_description: new FormControl<boolean>(false),
            custom_tags: new FormControl<boolean>(false),
            mature: new FormControl<boolean>(false),
        });

        this.title = this.get('title') as FormControl<string | null>;
        this.description = this.get('description') as FormControl<string | null>;
        this.tags = this.get('tags') as FormControl<string | null>;
        this.character = this.get('character') as FormControl<string | null>;
        this.location = this.get('location') as FormControl<string | null>;
        this.customTitle = this.get('custom_title') as FormControl<boolean>;
        this.customDescription = this.get('custom_description') as FormControl<boolean>;
        this.customTags = this.get('custom_tags') as FormControl<boolean>;
        this.mature = this.get('mature') as FormControl<boolean>;

        this.customTitle.valueChanges.subscribe(x => x ? this.title.enable() : this.title.disable());
        this.customDescription.valueChanges.subscribe(x => x ? this.description.enable() : this.description.disable());
        this.customTags.valueChanges.subscribe(x => x ? this.tags.enable() : this.tags.disable());
    }

    public title: FormControl<string | null>;
    public description: FormControl<string | null>;
    public tags: FormControl<string | null>;
    public character: FormControl<string | null>;
    public location: FormControl<string | null>;
    public customTitle: FormControl<boolean>;
    public customDescription: FormControl<boolean>;
    public customTags: FormControl<boolean>;
    public mature: FormControl<boolean>;
}
