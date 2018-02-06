import { Observable } from 'rxjs/Observable';
import { SharedModule } from '../../shared/shared.module';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { AddNodeFormComponent } from './add-node-form.component';

import { NgReduxTestingModule } from '@angular-redux/store/lib/testing/ng-redux-testing.module';

const modules: any[] = [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    NgReduxTestingModule
];

describe('AddNodeFormComponent', () => {
    let fixture: ComponentFixture<AddNodeFormComponent>;
    let component: AddNodeFormComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ...modules,
            ],
            declarations: [
                AddNodeFormComponent
            ],
            providers: [
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AddNodeFormComponent);
        component = fixture.componentInstance;
    });

    it('should create the add node form cmp', () => {
        expect(component).toBeTruthy();
    });
});