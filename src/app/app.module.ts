import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/template/sidebar/sidebar.component';
import { UploadComponent } from './views/upload/upload.component';
import { LoginComponent } from './views/login/login.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    UploadComponent,
    LoginComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
