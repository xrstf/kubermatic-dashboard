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

import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Auth} from '@core/services/auth/auth.service';

@Component({
  selector: 'km-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss'],
})
export class TermsOfServiceComponent {
  constructor(private readonly _auth: Auth, private readonly _router: Router) {}

  backToApp(): void {
    if (this._auth.authenticated()) {
      this._router.navigate(['/projects']);
    } else {
      this._router.navigate(['']);
    }
  }
}
