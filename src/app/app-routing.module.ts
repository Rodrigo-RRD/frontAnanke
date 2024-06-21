import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { UploadComponent } from './views/upload/upload.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';

const routes: Routes = [
  {
    path: "",
    component: LoginComponent 
  },
  {
    path: "home",
    component: LandingPageComponent
  },
  {
    path: "upload",
    component: UploadComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
