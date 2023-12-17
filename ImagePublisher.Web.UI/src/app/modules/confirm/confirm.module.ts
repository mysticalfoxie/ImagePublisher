import {NgModule} from "@angular/core";
import {ConfirmComponent} from "./component/confirm.component";
import {MaterialModule} from "../material.module";
import {ConfirmService} from "./confirm.service";

@NgModule({
    declarations: [ConfirmComponent],
    imports: [MaterialModule],
    providers: [ConfirmService]
})
export class ConfirmModule {

}
