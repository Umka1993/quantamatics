import { OrganizationID } from "./organization/types";

export interface NewAssetRequest {
    name: string,
    ownerOrganizationId: OrganizationID,
    version?: number | string,
}

export interface UpdateAssetRequest extends NewAssetRequest {
    id: number
}

export interface AssetServerResponse extends UpdateAssetRequest {
    creationDate: string
    lastModifiedDate: string
    ownerOrganization: null | any,
    type: number,
    userAssets: null  | any,
    organizationAssets: null  | any,
}