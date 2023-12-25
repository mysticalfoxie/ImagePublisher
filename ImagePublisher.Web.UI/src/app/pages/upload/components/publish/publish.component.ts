import {Component, ViewEncapsulation} from "@angular/core";
import {ActionBarService} from "../../action-bar.service";
import {StatusItemState} from "../../../../components/status-item/status.enum";

@Component({
    selector: 'app-publish-component',
    templateUrl: 'publish.component.html',
    styleUrls: ['publish.component.scss']
})
export class PublishComponent {
    public constructor(
        private _actionBar: ActionBarService,
    ) {
        this._actionBar.setSubject('Publish');
    }

    public webSocketState: StatusItemState = StatusItemState.NotStarted;
}
