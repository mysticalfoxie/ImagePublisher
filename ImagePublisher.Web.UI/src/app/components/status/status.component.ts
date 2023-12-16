import {Component, Input, ViewEncapsulation} from "@angular/core";

@Component({
    selector: 'app-status',
    templateUrl: 'status.component.html',
    styleUrls: ['status.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StatusComponent {
    @Input()
    public status?: boolean;
}
