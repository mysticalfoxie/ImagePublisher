import {FormControl, FormGroup} from "@angular/forms";

export class PTPresetForm extends FormGroup {
    public constructor() {
        super({
            title: new FormControl<string | null>(''),
            description: new FormControl<string | null>(''),
            tags: new FormControl<string | null>(''),
        });

        this.title = this.get('title') as FormControl<string | null>;
        this.description = this.get('description') as FormControl<string | null>;
        this.tags = this.get('tags') as FormControl<string | null>;
    }

    public title: FormControl<string | null>;
    public description: FormControl<string | null>;
    public tags: FormControl<string | null>;
}
