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

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';

import {ClusterService, NotificationService, ProjectService} from '../../../core/services';
import {GoogleAnalyticsService} from '../../../google-analytics.service';
import {Cluster, ClusterPatch} from '../../../shared/entity/cluster';
import {Project} from '../../../shared/entity/project';

@Component({
  selector: 'km-change-cluster-version',
  templateUrl: './change-cluster-version.component.html',
})
export class ChangeClusterVersionComponent implements OnInit, OnDestroy {
  @Input() cluster: Cluster;
  @Input() seed: string;
  controlPlaneVersions: string[] = [];
  selectedVersion: string;
  project: Project;
  isMachineDeploymentUpgradeEnabled = false;
  private _unsubscribe = new Subject<void>();

  constructor(
    private _clusterService: ClusterService,
    private _projectService: ProjectService,
    private _dialogRef: MatDialogRef<ChangeClusterVersionComponent>,
    public _googleAnalyticsService: GoogleAnalyticsService,
    private readonly _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.controlPlaneVersions.length > 0) {
      this.selectedVersion = this.controlPlaneVersions[this.controlPlaneVersions.length - 1];
    }

    this._projectService.selectedProject
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(project => (this.project = project));
    this._googleAnalyticsService.emitEvent('clusterOverview', 'clusterVersionChangeDialogOpened');
  }

  changeVersion(): void {
    const patch: ClusterPatch = {
      spec: {
        version: this.selectedVersion,
      },
    };

    this._clusterService.patch(this.project.id, this.cluster.id, this.seed, patch).subscribe(() => {
      this._notificationService.success(
        `The <strong>${this.cluster.name}</strong> cluster is being updated to the ${this.selectedVersion} version`
      );
      this._googleAnalyticsService.emitEvent('clusterOverview', 'clusterVersionChanged');

      if (this.isMachineDeploymentUpgradeEnabled) {
        this.upgradeMachineDeployments();
      }
    });

    this._dialogRef.close(true);
  }

  upgradeMachineDeployments(): void {
    this._clusterService
      .upgradeMachineDeployments(this.project.id, this.cluster.id, this.seed, this.selectedVersion)
      .pipe(first())
      .subscribe(() => {
        this._notificationService.success(
          `The machine deployments from the <strong>${this.cluster.name}</strong> cluster are being updated to the ${this.selectedVersion} version`
        );
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
