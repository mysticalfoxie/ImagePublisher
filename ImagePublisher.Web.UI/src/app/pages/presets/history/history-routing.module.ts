import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {HistoryRoutes} from "./history.routes";

@NgModule({
    imports: [RouterModule.forChild(HistoryRoutes)],
    exports: [RouterModule]
})
export class HistoryRoutingModule {

}
