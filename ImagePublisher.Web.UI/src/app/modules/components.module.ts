import {NgModule} from "@angular/core";
import {StatusComponent} from "../components/status/status.component";
import {ImageInputComponent} from "../components/image-input/image-input.component";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "./material.module";
import {LabelInputComponent} from "../components/label-input/label-input.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        StatusComponent,
        ImageInputComponent,
        LabelInputComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,

    ],
    exports: [
        StatusComponent,
        ImageInputComponent,
        LabelInputComponent
    ]
})
export class AppComponentsModule {

}
