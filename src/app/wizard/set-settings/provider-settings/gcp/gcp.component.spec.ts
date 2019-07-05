import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {WizardService} from '../../../../core/services/wizard/wizard.service';
import {SharedModule} from '../../../../shared/shared.module';
import {fakeGCPCluster} from '../../../../testing/fake-data/cluster.fake';
import {GCPClusterSettingsComponent} from './gcp.component';

describe('GCPClusterSettingsComponent', () => {
  let fixture: ComponentFixture<GCPClusterSettingsComponent>;
  let component: GCPClusterSettingsComponent;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports: [
            BrowserModule,
            BrowserAnimationsModule,
            HttpClientModule,
            ReactiveFormsModule,
            SharedModule,
          ],
          declarations: [
            GCPClusterSettingsComponent,
          ],
          providers: [
            WizardService,
          ],
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GCPClusterSettingsComponent);
    component = fixture.componentInstance;
    component.cluster = fakeGCPCluster();
    component.cluster.spec.cloud.gcp = {serviceAccount: '', network: '', subnetwork: ''};
    fixture.detectChanges();
  });

  it('should create the gcp cluster cmp', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid after creating', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('serviceAccount field validity', () => {
    expect(component.form.valid).toBeFalsy('form is initially not valid');
    expect(component.form.controls.serviceAccount.valid).toBeFalsy('serviceAccount field is initially not valid');
    expect(component.form.controls.serviceAccount.hasError('required'))
        .toBeTruthy('serviceAccount field has initially required error');

    component.form.controls.serviceAccount.patchValue('foo');
    expect(component.form.controls.serviceAccount.hasError('required'))
        .toBeFalsy('serviceAccount field has no required error after setting foo');
  });
});
