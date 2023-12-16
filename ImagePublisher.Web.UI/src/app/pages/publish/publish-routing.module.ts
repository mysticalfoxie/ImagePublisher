import {NgModule} from "@angular/core";
import {PublishRoutes} from "./publish.routes";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [RouterModule.forChild(PublishRoutes)],
    exports: [RouterModule]
})
export class PublishRoutingModule {

}
