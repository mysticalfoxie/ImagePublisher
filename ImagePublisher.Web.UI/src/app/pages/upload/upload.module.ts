import {NgModule} from "@angular/core";
import {UploadComponent} from "./upload.component";
import {UploadRoutingModule} from "./upload-routing.module";
import {WebSocketService} from "./websocket.service";
import {UploadService} from "./upload.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {BrowserModule} from "@angular/platform-browser";
import {DAUploadComponent} from "./components/da-upload/da-upload.component";
import {CommonModule} from "@angular/common";
import {SelectComponent} from "./components/select/select.component";
import {ActionBarService} from "./action-bar.service";
import {UploadDataService} from "./upload-data.service";
import {PublishComponent} from "./components/publish/publish.component";
import {AppComponentsModule} from "../../modules/components.module";
import {MaterialModule} from "../../modules/material.module";

@NgModule({
    declarations: [
        UploadComponent,
        DAUploadComponent,
        SelectComponent,
        PublishComponent
    ],
    imports: [
        UploadRoutingModule,
        AppComponentsModule,
        MaterialModule,
        CommonModule,
    ],
    providers: [
        UploadService,
        UploadDataService,
        WebSocketService,
        ActionBarService
    ]
})
export class UploadModule {

}
