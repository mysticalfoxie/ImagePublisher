import {NgModule} from "@angular/core";
import {StatusComponent} from "../components/status/status.component";
import {ImageInputComponent} from "../components/image-input/image-input.component";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "./material.module";

@NgModule({
    declarations: [
        StatusComponent,
        ImageInputComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        StatusComponent,
        ImageInputComponent
    ]
})
export class AppComponentsModule {

}
