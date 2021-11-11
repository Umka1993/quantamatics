import { ApiRoute } from "../../data/enum";
import { ThunkActionResult } from "../../types/thunk-actions"

export const fetchOrganizationUsers =
    (orgId: any, onFinish: any, onError: any): ThunkActionResult =>
        async (_dispatch, _getState, api) => {
            api
                .get(ApiRoute.GetUsersByOrgID, {params: { orgId }})
                .then(onFinish)
                .catch(onError);
        };

export const fetchUserByID =
        (id: any, onFinish?: any, onError?: any): ThunkActionResult =>
            async (_dispatch, _getState, api) => {
                api
                    .get(ApiRoute.GetUserByID, {params: { id }})
                    .then(onFinish)
                    .catch(onError);
            };