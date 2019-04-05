import {NgReduxFormModule} from '@angular-redux/form';
import {NgReduxModule} from '@angular-redux/store';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {AppConfigService} from './app-config.service';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {ProjectService, UserService} from './core/services';
import {DashboardComponent} from './dashboard/dashboard.component';
import {GoogleAnalyticsService} from './google-analytics.service';
import {KubermaticComponent} from './kubermatic.component';
import {AddMemberComponent} from './member/add-member/add-member.component';
import {EditMemberComponent} from './member/edit-member/edit-member.component';
import {MobileNavigationComponent} from './overlays';
import {SharedModule} from './shared/shared.module';

const appInitializerFn = (appConfig: AppConfigService): Function => {
  return () => appConfig.loadAppConfig()
                   .then(() => appConfig.loadUserGroupConfig())
                   .then(() => appConfig.loadGitVersion())
                   .then(() => appConfig.checkCustomCSS());
};

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgReduxFormModule,
    NgReduxModule,
    RouterModule,
  ],
  declarations: [
    KubermaticComponent,
    DashboardComponent,
    MobileNavigationComponent,
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService],
    },
    CookieService,
    ProjectService,
    UserService,
    GoogleAnalyticsService,
  ],
  entryComponents: [
    MobileNavigationComponent,
    AddMemberComponent,
    EditMemberComponent,
  ],
  bootstrap: [KubermaticComponent],
})

export class AppModule {
}
