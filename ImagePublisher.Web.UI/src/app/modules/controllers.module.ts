import {NgModule} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {HttpClientService} from "../services/httpClient.service";
import {PresetsController} from "../controllers/presets.controller";

@NgModule({
    imports: [HttpClientModule],
    providers: [
        PresetsController,
        HttpClientService
    ]
})
export class AppControllersModule {

}
