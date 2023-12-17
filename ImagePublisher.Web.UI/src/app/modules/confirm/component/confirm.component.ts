import {Component, Input, ViewEncapsulation} from "@angular/core";

@Component({
    selector: 'app-confirm-component',
    templateUrl: 'confirm.component.html',
    styleUrls: ['confirm.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfirmComponent {
    @Input() public title: string | undefined;
    @Input() public description: string | undefined;
}
