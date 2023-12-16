import {Component, ViewEncapsulation} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {Subject} from "rxjs";

export interface Element {
    id: number;
    image: string;
    title: string;
    description: string;
    createdAt: string;
}

const ELEMENTS: Element[] = [
    {id: 0, image: '/assets/00014-349608318.png', title: 'Cute fawzy booo', description: 'This faaaaaaaaaaaaaaawzy is ssooo incredibly cute as fuck omg yea i love her she is so cute i wanna hug her, shes screeking so cute and looking so cute omg omg omg i like her a lot with her little fur ears maaawhwhhhhwhwhwhhwhw fawzy!!', createdAt: '12.09.2023 - 09:24 Uhr' },
    {id: 1, image: '/assets/00014-349608318.png', title: 'Another faaawzy booo', description: 'This faaaaaaaaaaaaaaawzy is ssooo incredibly cute as fuck omg yea i love her she is so cute i wanna hug her, shes screeking so cute and looking so cute omg omg omg i like her a lot with her little fur ears maaawhwhhhhwhwhwhhwhw fawzy!!', createdAt: '12.09.2023 - 09:24 Uhr' },
    {id: 2, image: '/assets/00014-349608318.png', title: 'Cute lil foxiie', description: 'This faaaaaaaaaaaaaaawzy is ssooo incredibly cute as fuck omg yea i love her she is so cute i wanna hug her, shes screeking so cute and looking so cute omg omg omg i like her a lot with her little fur ears maaawhwhhhhwhwhwhhwhw fawzy!!', createdAt: '12.09.2023 - 09:24 Uhr' },
    {id: 3, image: '/assets/00014-349608318.png', title: 'Cute Fox UwU', description: 'This faaaaaaaaaaaaaaawzy is ssooo incredibly cute as fuck omg yea i love her she is so cute i wanna hug her, shes screeking so cute and looking so cute omg omg omg i like her a lot with her little fur ears maaawhwhhhhwhwhwhhwhw fawzy!!', createdAt: '12.09.2023 - 09:24 Uhr' },
    {id: 4, image: '/assets/00014-349608318.png', title: 'Is this me <3 OMG', description: 'This faaaaaaaaaaaaaaawzy is ssooo incredibly cute as fuck omg yea i love her she is so cute i wanna hug her, shes screeking so cute and looking so cute omg omg omg i like her a lot with her little fur ears maaawhwhhhhwhwhwhhwhw fawzy!!', createdAt: '12.09.2023 - 09:24 Uhr' },
    {id: 5, image: '/assets/00014-349608318.png', title: 'This should be the absolut longest text that i image', description: 'This faaaaaaaaaaaaaaawzy is ssooo incredibly cute as fuck omg yea i love her she is so cute i wanna hug her, shes screeking so cute and looking so cute omg omg omg i like her a lot with her little fur ears maaawhwhhhhwhwhwhhwhw fawzy!!', createdAt: '12.09.2023 - 09:24 Uhr' },
];

@Component({
    selector: 'app-presets-component',
    templateUrl: 'presets.component.html',
    styleUrls: ['presets.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PresetsComponent {
    constructor() {

    }

    public displayedColumns: string[] = ['image', 'title', 'description', 'timestamp', 'actions' ];
    public dataSource = new MatTableDataSource(ELEMENTS);

    public edit$ = new Subject<number>();
    public delete$ = new Subject<number>();
    public upload$ = new Subject<number>();
}
