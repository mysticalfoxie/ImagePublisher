import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {PresetsRoutes} from "./presets.routes";

@NgModule({
    imports: [RouterModule.forChild(PresetsRoutes)],
    exports: [RouterModule]
})
export class PresetsRoutingModule {

}
