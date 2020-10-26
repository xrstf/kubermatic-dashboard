// Copyright 2020 The Kubermatic Kubernetes Platform contributors.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {HttpClientModule} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppConfigService} from '@app/config.service';
import {RouterTestingModule} from '@app/testing/router-stubs';
import {AppConfigMockService} from '@app/testing/services/app-config-mock.service';
import {AuthMockService} from '@app/testing/services/auth-mock.service';
import {Auth} from '@core/services/auth/auth.service';
import {SharedModule} from '@shared/shared.module';
import {SettingsService} from './settings.service';

describe('SettingsService', () => {
  let settingsService: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, HttpClientModule, BrowserAnimationsModule, RouterTestingModule, SharedModule],
      providers: [
        SettingsService,
        {provide: AppConfigService, useClass: AppConfigMockService},
        {provide: Auth, useClass: AuthMockService},
      ],
    });
    settingsService = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(settingsService).toBeTruthy();
  });
});
