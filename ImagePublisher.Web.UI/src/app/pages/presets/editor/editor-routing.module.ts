import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {EditorRoutes} from "./editor.routes";

@NgModule({
    imports: [RouterModule.forChild(EditorRoutes)],
    exports: [RouterModule]
})
export class EditorRoutingModule {

}
