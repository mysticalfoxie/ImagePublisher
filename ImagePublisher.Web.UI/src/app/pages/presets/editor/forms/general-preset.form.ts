import {FormControl, FormGroup} from "@angular/forms";

export class GeneralPresetForm extends FormGroup {
    constructor() {
        super({
            title: new FormControl<string | null>(''),
            description: new FormControl<string | null>(''),
            tags: new FormControl<string | null>(''),
            hdld: new FormControl<boolean>(false),
            hdImage: new FormControl<string | null>(''),
            ldImage: new FormControl<string | null>(''),
            image: new FormControl<string | null>('')
        });

        this.title = this.get('title') as FormControl<string | null>;
        this.description = this.get('description') as FormControl<string | null>;
        this.tags = this.get('tags') as FormControl<string | null>;
        this.hdld = this.get('hdld') as FormControl<boolean>;
        this.hdImage = this.get('hdImage') as FormControl<string | null>;
        this.ldImage = this.get('ldImage') as FormControl<string | null>;
        this.image = this.get('image') as FormControl<string | null>;
    }

    public title: FormControl<string | null>;
    public description: FormControl<string | null>;
    public tags: FormControl<string | null>;
    public hdld: FormControl<boolean>;
    public hdImage: FormControl<string | null>;
    public ldImage: FormControl<string | null>;
    public image: FormControl<string | null>;
}
