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

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogRef} from '@angular/material/dialog';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ClusterMockService} from '@app/testing/services/cluster-mock-service';
import {MatDialogRefMock} from '@app/testing/services/mat-dialog-ref-mock';
import {ClusterService} from '@core/services/cluster/cluster.service';
import {SharedModule} from '@shared/shared.module';
import {AlibabaProviderSettingsComponent} from '../alibaba-provider-settings/alibaba-provider-settings.component';
import {AWSProviderSettingsComponent} from '../aws-provider-settings/aws-provider-settings.component';
import {AzureProviderSettingsComponent} from '../azure-provider-settings/azure-provider-settings.component';
import {DigitaloceanProviderSettingsComponent} from '../digitalocean-provider-settings/digitalocean-provider-settings.component';
import {EditProviderSettingsComponent} from '../edit-provider-settings.component';
import {GCPProviderSettingsComponent} from '../gcp-provider-settings/gcp-provider-settings.component';
import {HetznerProviderSettingsComponent} from '../hetzner-provider-settings/hetzner-provider-settings.component';
import {KubevirtProviderSettingsComponent} from '../kubevirt-provider-settings/kubevirt-provider-settings.component';
import {OpenstackProviderSettingsComponent} from '../openstack-provider-settings/openstack-provider-settings.component';
import {PacketProviderSettingsComponent} from '../packet-provider-settings/packet-provider-settings.component';
import {VSphereProviderSettingsComponent} from './vsphere-provider-settings.component';

const modules: any[] = [BrowserModule, BrowserAnimationsModule, SharedModule];

describe('VSphereProviderSettingsComponent', () => {
  let fixture: ComponentFixture<VSphereProviderSettingsComponent>;
  let component: VSphereProviderSettingsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...modules],
      declarations: [
        EditProviderSettingsComponent,
        AWSProviderSettingsComponent,
        DigitaloceanProviderSettingsComponent,
        HetznerProviderSettingsComponent,
        OpenstackProviderSettingsComponent,
        VSphereProviderSettingsComponent,
        AzureProviderSettingsComponent,
        PacketProviderSettingsComponent,
        GCPProviderSettingsComponent,
        KubevirtProviderSettingsComponent,
        AlibabaProviderSettingsComponent,
      ],
      providers: [
        {provide: ClusterService, useClass: ClusterMockService},
        {provide: MatDialogRef, useClass: MatDialogRefMock},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VSphereProviderSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize', () => {
    expect(component).toBeTruthy();
  });

  it('form valid after creating', () => {
    expect(component.form.valid).toBeTruthy();
  });
});
