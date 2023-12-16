import {NgModule} from "@angular/core";
import {UploadComponent} from "./upload.component";
import {DAUploadComponent} from "./components/da-upload.component";
import {UploadRoutingModule} from "./upload-routing.module";

@NgModule({
    declarations: [
        UploadComponent,
        DAUploadComponent,
    ],
    imports: [UploadRoutingModule]
})
export class UploadModule {

}
