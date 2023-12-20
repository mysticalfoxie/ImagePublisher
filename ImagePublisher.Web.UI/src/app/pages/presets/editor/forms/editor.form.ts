import {FormGroup} from "@angular/forms";
import {BehaviorSubject, map, Subject} from "rxjs";
import {GeneralPresetForm} from "./general-preset.form";
import {EditorModel} from "../../../../models/editor.model";
import {DAPresetForm} from "./da-preset.form";
import {FBPresetForm} from "./fb-preset.form";
import {IGPresetForm} from "./ig-preset.form";
import {PTPresetForm} from "./pt-preset.form";

export class EditorForm extends FormGroup {
    public constructor() {
        super({
            general: new GeneralPresetForm(),
            deviantart: new DAPresetForm(),
            instagram: new IGPresetForm(),
            facebook: new FBPresetForm(),
            pinterest: new PTPresetForm()
        });

        this.general = this.get('general') as GeneralPresetForm;
        this.deviantart = this.get('deviantart') as DAPresetForm;
        this.instagram = this.get('instagram') as IGPresetForm;
        this.facebook = this.get('facebook') as FBPresetForm;
        this.pinterest = this.get('pinterest') as PTPresetForm;

        this.valueChanges
            .pipe(map(() => this.getRawValue() as EditorModel))
            .subscribe(x => this.data$.next(x));
    }

    public readonly data$ = new BehaviorSubject<EditorModel | null>(null);
    public readonly clear$ = new Subject();

    public general: GeneralPresetForm;
    public deviantart: DAPresetForm;
    public instagram: IGPresetForm;
    public facebook: FBPresetForm;
    public pinterest: PTPresetForm;

    public initialize(model: EditorModel | null = null): void {
        this.general.title.setValue(model?.general.title || '');
        this.general.description.setValue(model?.general.description || '');
        this.general.tags.setValue(model?.general.tags || '');
        this.general.hdld.setValue(model?.general.hdld || false);
        this.general.hdImage.setValue(model?.general.hdImage || '');
        this.general.ldImage.setValue(model?.general.ldImage || '');
        this.general.image.setValue(model?.general.image || '');

        this.deviantart.title.setValue(model?.deviantart.title ? model?.deviantart.title : model?.general.title || '');
        this.deviantart.description.setValue(model?.deviantart.description ? model?.deviantart.description : model?.general.description || '');
        this.deviantart.tags.setValue(model?.deviantart.tags ? model?.deviantart.tags : model?.general.tags || '');
        this.deviantart.character.setValue(model?.deviantart.character || '');
        this.deviantart.location.setValue(model?.deviantart.location || '');
    }

    public clear(): void {
        this.initialize(null);
        this.clear$.next(null);
    }
}


