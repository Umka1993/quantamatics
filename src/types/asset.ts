import { OrganizationID } from "./organization/types";

export interface  NewAssetRequest{
    name: string,
    ownerOrganizationId: OrganizationID,
    version?: number | string,
}

export interface AssetServerResponse extends NewAssetRequest {
    id: number,
    creationDate?: string,
    lastModifiedDate?: string,
    ownerOrganization?: null | any,
    type?: number,
    userAssets?: null  | any,
    organizationAssets?: null  | any,
}