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

import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {MatDialogRef} from '@angular/material/dialog';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {CoreModule} from '../../core/core.module';
import {ApiService, NotificationService} from '../../core/services';
import {SharedModule} from '../../shared/shared.module';
import {fakeProject} from '../../testing/fake-data/project.fake';
import {fakeServiceAccount} from '../../testing/fake-data/serviceaccount.fake';
import {asyncData} from '../../testing/services/api-mock.service';
import {MatDialogRefMock} from '../../testing/services/mat-dialog-ref-mock';

import {EditServiceAccountComponent} from './edit-serviceaccount.component';

const modules: any[] = [BrowserModule, BrowserAnimationsModule, SharedModule, CoreModule];

describe('EditServiceAccountComponent', () => {
  let fixture: ComponentFixture<EditServiceAccountComponent>;
  let component: EditServiceAccountComponent;
  let editServiceAccountSpy;

  beforeEach(async(() => {
    const apiMock = {editServiceAccount: jest.fn()};
    editServiceAccountSpy = apiMock.editServiceAccount.mockReturnValue(asyncData(fakeServiceAccount()));

    TestBed.configureTestingModule({
      imports: [...modules],
      providers: [
        {provide: MatDialogRef, useClass: MatDialogRefMock},
        {provide: ApiService, useValue: apiMock},
        NotificationService,
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditServiceAccountComponent);
    component = fixture.componentInstance;
    component.project = fakeProject();
    component.serviceaccount = fakeServiceAccount();
    fixture.detectChanges();
  }));

  it('should create the edit service account component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should have valid form after creating', () => {
    expect(component.editServiceAccountForm.valid).toBeTruthy();
  });

  it('should call editServiceAccount method', fakeAsync(() => {
    component.editServiceAccountForm.controls.name.patchValue('test-service-account');
    component.editServiceAccountForm.controls.group.patchValue('editors');
    component.editServiceAccount();
    tick();

    expect(editServiceAccountSpy).toHaveBeenCalled();
  }));
});
