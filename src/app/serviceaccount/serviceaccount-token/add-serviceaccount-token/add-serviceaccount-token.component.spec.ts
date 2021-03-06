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

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {CoreModule} from '../../../core/core.module';
import {ApiService, NotificationService, ProjectService} from '../../../core/services';
import {SharedModule} from '../../../shared/shared.module';
import {fakeProject} from '../../../testing/fake-data/project.fake';
import {fakeServiceAccount, fakeServiceAccountTokens} from '../../../testing/fake-data/serviceaccount.fake';
import {asyncData} from '../../../testing/services/api-mock.service';
import {MatDialogRefMock} from '../../../testing/services/mat-dialog-ref-mock';
import {ProjectMockService} from '../../../testing/services/project-mock.service';

import {AddServiceAccountTokenComponent} from './add-serviceaccount-token.component';

const modules: any[] = [BrowserModule, BrowserAnimationsModule, SharedModule, CoreModule];

describe('AddServiceAccountTokenComponent', () => {
  let fixture: ComponentFixture<AddServiceAccountTokenComponent>;
  let component: AddServiceAccountTokenComponent;

  beforeEach(async(() => {
    const apiMock = {createServiceAccountToken: jest.fn()};
    apiMock.createServiceAccountToken.mockReturnValue(asyncData(fakeServiceAccountTokens()));

    TestBed.configureTestingModule({
      imports: [...modules],
      providers: [
        {provide: MatDialogRef, useClass: MatDialogRefMock},
        {provide: ApiService, useValue: apiMock},
        {provide: ProjectService, useClass: ProjectMockService},
        MatDialog,
        NotificationService,
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddServiceAccountTokenComponent);
    component = fixture.componentInstance;
    component.project = fakeProject();
    component.serviceaccount = fakeServiceAccount();
    fixture.detectChanges();
  }));

  it('should create the add service account token component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('form invalid after  creating', () => {
    expect(component.addServiceAccountTokenForm.valid).toBeFalsy();
  });

  it('should have required fields', () => {
    expect(component.addServiceAccountTokenForm.valid).toBeFalsy();
    expect(component.addServiceAccountTokenForm.controls.name.valid).toBeFalsy();
    expect(component.addServiceAccountTokenForm.controls.name.hasError('required')).toBeTruthy();

    component.addServiceAccountTokenForm.controls.name.patchValue('test-service-account-token');
    expect(component.addServiceAccountTokenForm.controls.name.hasError('required')).toBeFalsy();
  });
});
