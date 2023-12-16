import {NgModule} from "@angular/core";
import {SettingsComponent} from "./settings.component";
import {SettingsRoutingModule} from "./settings-routing.module";

@NgModule({
    declarations: [
        SettingsComponent
    ],
    imports: [SettingsRoutingModule]
})
export class SettingsModule {

}
