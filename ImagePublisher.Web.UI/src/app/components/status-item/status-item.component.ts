import {Component, Input} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {StatusItemState} from "./status.enum";

@Component({
    selector: 'app-status-item',
    templateUrl: 'status-item.component.html',
    styleUrls: ['status-item.component.scss']
})
export class StatusItemComponent {
    public status$ = new BehaviorSubject<StatusItemState>(StatusItemState.NotStarted);
    public Status = StatusItemState;

    @Input()
    public set status(value: StatusItemState) {
        setTimeout(() => this.status$.next(value));
    }
}
