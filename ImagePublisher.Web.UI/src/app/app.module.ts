import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {StatusComponent} from "./components/status/status.component";
import {MaterialModule} from "./modules/material.module";

@NgModule({
    declarations: [
        AppComponent,
        StatusComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MaterialModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
