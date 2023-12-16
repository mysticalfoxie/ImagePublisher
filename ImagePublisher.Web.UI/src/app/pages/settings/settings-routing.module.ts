import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SettingsRoutes} from "./settings.routes";

@NgModule({
    imports: [RouterModule.forChild(SettingsRoutes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule {

}
