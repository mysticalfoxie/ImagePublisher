import {NgModule} from "@angular/core";
import {PresetsComponent} from "./presets.component";
import {PresetsRoutingModule} from "./presets-routing.module";
import {MaterialModule} from "../../modules/material.module";
import {CommonModule, NgOptimizedImage} from "@angular/common";

@NgModule({
    declarations: [PresetsComponent],
    imports: [
        CommonModule,
        PresetsRoutingModule,
        NgOptimizedImage,
        MaterialModule
    ],
})
export class PresetsModule {

}
