import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {StatusComponent} from "./components/status/status.component";
import {MaterialModule} from "./modules/material.module";
import {ConfirmModule} from "./modules/confirm/confirm.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppComponentsModule} from "./modules/components.module";
import {AppControllersModule} from "./modules/controllers.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppControllersModule,
        AppComponentsModule,
        AppRoutingModule,
        MaterialModule,
        ConfirmModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
