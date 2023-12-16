import {NgModule} from "@angular/core";
import {HistoryRoutingModule} from "./history-routing.module";
import {HistoryComponent} from "./history.component";
import {MaterialModule} from "../../../modules/material.module";

@NgModule({
    declarations: [HistoryComponent],
    imports: [
        HistoryRoutingModule,
        MaterialModule
    ]
})
export class HistoryModule {

}
