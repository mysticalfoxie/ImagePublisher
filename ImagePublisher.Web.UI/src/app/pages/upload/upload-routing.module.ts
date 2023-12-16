import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {UploadRoutes} from "./upload.routes";

@NgModule({
    imports: [RouterModule.forChild(UploadRoutes)],
    exports: [RouterModule]
})
export class UploadRoutingModule {

}
