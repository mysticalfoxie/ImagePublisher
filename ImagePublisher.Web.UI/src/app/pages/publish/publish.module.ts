import {NgModule} from "@angular/core";
import {PublishComponent} from "./publish.component";
import {PublishRoutingModule} from "./publish-routing.module";
import {DAPublisherComponent} from "./components/da-publisher.component";

@NgModule({
    declarations: [
        PublishComponent,
        DAPublisherComponent,
    ],
    imports: [PublishRoutingModule]
})
export class PublishModule {

}
