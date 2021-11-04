import { AxiosRequestConfig } from "axios";
import { ApiRoute } from "../../data/enum";
import { Organization } from "../../types/organization/types"
import { ThunkActionResult } from "../../types/thunk-actions";

export const fetchOrganizations = (organizations: Organization[]) => ({
    type: 'ADD_ORGS',
    payload: {organizations: organizations},
});


/* async Action */
interface OrganizationInfoResponse {
    assets: any,
    comments: string,
    customerCrmId: string,
    customerCrmLink: string,
    id: string,
    name: string;
}

export const fetchOrganization = (id: string, onFinish : any): ThunkActionResult =>
        async (_dispatch, _getState, api) => {
            api.get<OrganizationInfoResponse>(ApiRoute.OrganizationInfo, {params: {id}})
            .then(({ data }: any) => {
                onFinish(data)
            })
            .catch(({response}) => {
                console.log(response);
            })
        }; 


export const createOrganization = (organization: any, onFinish : any, onError: any): ThunkActionResult =>
    async (_dispatch, _getState, api) => {
        api.post(ApiRoute.OrganizationCreate, {...organization})
        .then(({ data }: any) => {
            console.log(data);
            onFinish(data)
        })
        .catch(({response}) => {
            console.log(response);
            onError()
        })
    }; 