import {FormControl, FormGroup} from "@angular/forms";

export class FBPresetForm extends FormGroup {
    constructor() {
        super({
            title: new FormControl<string | null>(''),
            description: new FormControl<string | null>(''),
            hashtags: new FormControl<string | null>('')
        });

        this.title = this.get('title') as FormControl<string | null>;
        this.description = this.get('description') as FormControl<string | null>;
        this.hashtags = this.get('hashtags') as FormControl<string | null>;
    }

    public title: FormControl<string | null>;
    public description: FormControl<string | null>;
    public hashtags: FormControl<string | null>;
}
