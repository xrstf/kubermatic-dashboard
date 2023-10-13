/*
Copyright 2020 The Kubermatic Kubernetes Platform contributors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package provider

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-kit/kit/endpoint"

	apiv1 "k8c.io/dashboard/v2/pkg/api/v1"
	handlercommon "k8c.io/dashboard/v2/pkg/handler/common"
	providercommon "k8c.io/dashboard/v2/pkg/handler/common/provider"
	"k8c.io/dashboard/v2/pkg/handler/v1/common"
	"k8c.io/dashboard/v2/pkg/handler/v2/cluster"
	"k8c.io/dashboard/v2/pkg/provider"
	utilerrors "k8c.io/kubermatic/v2/pkg/util/errors"

	"k8s.io/utils/ptr"
)

// equinixMetalSizesNoCredentialsReq represent a request for Equinix Metal sizes EP
// swagger:parameters listPacketSizesNoCredentialsV2 listEquinixMetalSizesNoCredentialsV2
type equinixMetalSizesNoCredentialsReq struct {
	cluster.GetClusterReq
}

// GetSeedCluster returns the SeedCluster object.
func (req equinixMetalSizesNoCredentialsReq) GetSeedCluster() apiv1.SeedCluster {
	return apiv1.SeedCluster{
		ClusterID: req.ClusterID,
	}
}

func DecodeEquinixMetalSizesNoCredentialsReq(c context.Context, r *http.Request) (interface{}, error) {
	var req equinixMetalSizesNoCredentialsReq
	clusterID, err := common.DecodeClusterID(c, r)
	if err != nil {
		return nil, err
	}
	req.ClusterID = clusterID

	pr, err := common.DecodeProjectRequest(c, r)
	if err != nil {
		return nil, err
	}
	req.ProjectReq = pr.(common.ProjectReq)

	return req, nil
}

func EquinixMetalSizesWithClusterCredentialsEndpoint(projectProvider provider.ProjectProvider, privilegedProjectProvider provider.PrivilegedProjectProvider, seedsGetter provider.SeedsGetter, userInfoGetter provider.UserInfoGetter, settingsProvider provider.SettingsProvider) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		req := request.(equinixMetalSizesNoCredentialsReq)
		return providercommon.PacketSizesWithClusterCredentialsEndpoint(ctx, userInfoGetter, projectProvider, privilegedProjectProvider, seedsGetter, settingsProvider, req.ProjectID, req.ClusterID)
	}
}

// EquinixMetalProjectSizesReq represent a request for Equinix Metal sizes.
// swagger:parameters listProjectEquinixMetalSizes
type EquinixMetalProjectSizesReq struct {
	common.ProjectReq

	// in: header
	// name: APIKey
	APIKey string
	// in: header
	// name: EquinixProjectID
	EquinixProjectID string
	// in: header
	// name: Credential
	Credential string
	// in: header
	// DatacenterName datacenter name
	DatacenterName string
}

func DecodeEquinixMetalProjectSizesReq(ctx context.Context, r *http.Request) (interface{}, error) {
	projectReq, err := common.DecodeProjectRequest(ctx, r)
	if err != nil {
		return nil, err
	}

	return EquinixMetalProjectSizesReq{
		ProjectReq:       projectReq.(common.ProjectReq),
		APIKey:           r.Header.Get("APIKey"),
		EquinixProjectID: r.Header.Get("EquinixProjectID"),
		Credential:       r.Header.Get("Credential"),
		DatacenterName:   r.Header.Get("DatacenterName"),
	}, nil
}

func EquinixMetalProjectSizesEndpoint(presetProvider provider.PresetProvider, userInfoGetter provider.UserInfoGetter, seedsGetter provider.SeedsGetter, settingsProvider provider.SettingsProvider) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		req := request.(EquinixMetalProjectSizesReq)

		projectID := req.EquinixProjectID
		apiKey := req.APIKey

		userInfo, err := userInfoGetter(ctx, "")
		if err != nil {
			return nil, common.KubernetesErrorToHTTPError(err)
		}
		if len(req.Credential) > 0 {
			preset, err := presetProvider.GetPreset(ctx, userInfo, ptr.To(req.GetProjectID()), req.Credential)
			if err != nil {
				return nil, utilerrors.New(http.StatusInternalServerError, fmt.Sprintf("can not get preset %s for user %s", req.Credential, userInfo.Email))
			}

			if credentials := preset.Spec.Packet; credentials != nil {
				projectID = credentials.ProjectID
				apiKey = credentials.APIKey
			}
		}

		settings, err := settingsProvider.GetGlobalSettings(ctx)
		if err != nil {
			return nil, common.KubernetesErrorToHTTPError(err)
		}

		filter := *settings.Spec.MachineDeploymentVMResourceQuota
		datacenterName := req.DatacenterName
		if datacenterName != "" {
			_, datacenter, err := provider.DatacenterFromSeedMap(userInfo, seedsGetter, datacenterName)
			if err != nil {
				return nil, fmt.Errorf("error getting dc: %w", err)
			}

			filter = handlercommon.DetermineMachineFlavorFilter(datacenter.Spec.MachineFlavorFilter, settings.Spec.MachineDeploymentVMResourceQuota)
		}

		return providercommon.PacketSizes(apiKey, projectID, filter)
	}
}
