import Button, { ResetButton } from "../button";
import React, {
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Organization } from "types/organization/types";
import Headline from "../page-title";
import Input, { Multiselect } from "../app-input";

import style from "./styles/edit-organization.module.scss";
import { useNavigate } from "react-router-dom";
import {
  useGetOrganizationInfoMutation,
  useUpdateOrganizationMutation,
} from "../../api/organization";
import Loader from "../loader";
import { AppRoute, UserRole } from "../../data/enum";
import * as assetsHooks from "../../api/asset";
import useDuplicatedOrgValues from "../../hooks/useDuplicatedOrgValues";
import { AssetInOrganization, AssetListItem } from "../../types/asset";
import useUser from "../../hooks/useUser";
import normalizeName from "../../services/normalize-name";
// import useUpdateOrgUserAssets from "../../hooks/useUpdateOrgUserAssets";
import { useGetOrganizationUsersQuery } from "../../api/user";
interface EditOrganizationFormProps {
  organization?: Organization;
  isHaveAccessToOrgList?: boolean;
  externalLoad?: boolean;
}

const EditOrganizationForm: FunctionComponent<EditOrganizationFormProps> = ({
  organization,
  isHaveAccessToOrgList,
  externalLoad,
}) => {
  const user = useUser();
  const navigate = useNavigate();
  const [assetError, setAssetError] = useState(false);
  const [
    update,
    {
      isSuccess: isUpdated,
      isLoading: isUpdating,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateOrganizationMutation();

  const { data: orgUsers } = useGetOrganizationUsersQuery(
    organization?.id as string
  );

  const isHaveAccessToEditAsset =
    user?.userRoles.includes(UserRole.OrgOwner) ||
    user?.userRoles.includes(UserRole.Admin);

  const [name, setName] = useState<string>("");
  const [customerCrmId, setCustomerID] = useState<string>("");
  const [customerCrmLink, setCustomerLink] = useState<string>("");
  const [comments, setComment] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const [assignedAssets, setAssignedAssets] = useState<AssetInOrganization[]>(
    organization?.organizationAssets || []
  );

  const formRef = useRef<HTMLFormElement>(null);

  const [getInfoOrg] = useGetOrganizationInfoMutation();

  const [
    duplicateOrgError,
    duplicateIdError,
    checkNameDuplicate,
    checkIdDuplicate,
  ] = useDuplicatedOrgValues(
    formRef,
    name,
    customerCrmId,
    setName,
    setCustomerID
  );

  const [options, setOptions] = useState<AssetInOrganization[]>([]);

  function initOptions() {
    if (organization && user) {
      const prepareOptions = (allAssets: AssetInOrganization[]) => {
        setOptions(
          [...allAssets].map((asset) => {
            const alreadySelectedAsset = organization.organizationAssets.find(
              ({ assetId }) => assetId === asset.assetId
            );
            // ! try change “00000000-0000-0000-0000-000000000000” to orgId. It's still responds error when we try add new asset on update

            return alreadySelectedAsset === undefined ? { ...asset, organizationId: organization.id }
              : alreadySelectedAsset;
            /* return alreadySelectedAsset === undefined
              ? {
                  ...asset,
                  organizationId: organization.id,
                  asset: {
                    ...asset.asset,
                    ownerOrganizationId: organization.id,
                  },
                }
              : {
                  ...alreadySelectedAsset,
                  asset: {
                    ...alreadySelectedAsset.asset,
                    ownerOrganizationId: organization.id,
                  }, 
                };*/
          })
        );
      };

      // check if organization has some assets that parent org doesn't has
      // ! It will be waste if we start update all child organizations on updating org
      organization.parentId &&
        getInfoOrg(organization.parentId)
          .unwrap()
          .then(({ organizationAssets: allAssets }) => {
            organization.organizationAssets.forEach(
              ({ assetId }) =>
                allAssets.findIndex((asset) => asset.assetId === assetId) ===
                -1 && unlinkAsset({ assetId, orgId: organization.id })
            );

            organization.parentId === user.organizationId &&
              prepareOptions(allAssets);
          });

      // Prepare data for multiselect
      organization.parentId !== user.organizationId &&
        getInfoOrg(user.organizationId as string)
          .unwrap()
          .then(({ organizationAssets: allAssets }) =>
            prepareOptions(allAssets)
          );
    }
  }

  useEffect(initOptions, [organization, user]);

  const [linkAsset, { isLoading: isLinkingAsset }] =
    assetsHooks.useLinkAssetToOrgMutation();

  const [unlinkAsset, { isLoading: isUnLinking }] =
    assetsHooks.useUnlinkAssetToOrgMutation();

  const [linkAssetToUser] = assetsHooks.useLinkAssetToUserMutation();
  const [unlinkAssetFromUser] = assetsHooks.useUnlinkAssetToUserMutation();

  const setInitialOrg = useCallback(() => {
    if (organization) {
      setName(organization.name);
      setCustomerID(organization.customerCrmId);
      setCustomerLink(organization.customerCrmLink);
      setComment(organization.comments);
    }
  }, [organization]);

  useEffect(() => {
    organization && setInitialOrg();
  }, [organization]);

  function submitHandler(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setLoading(true);

    if (!assignedAssets.length) {
      setAssetError(true);
      return setLoading(false);
    }

    let duplicate = false;

    const normalizedName = normalizeName(name);

    if (normalizedName !== organization?.name) {
      duplicate = checkNameDuplicate();
    }

    if (customerCrmId !== organization?.customerCrmId) {
      duplicate = checkIdDuplicate() || duplicate;
    }

    if (duplicate) {
      return setLoading(false);
    }

    if (organization) {
      /**
       * ! Manually iterate in all org users and unlink unselected assets and link shared by default
       */
      /* if (orgUsers) {
        organization.organizationAssets.forEach(asset => {
          const foundedNewAsset = assignedAssets.find(newAsset => newAsset.assetId === asset.assetId)

          if (foundedNewAsset === undefined) {
            orgUsers.forEach(user =>
              unlinkAssetFromUser({ assetId: asset.assetId, userId: user.id })
            )
          } else {
            foundedNewAsset.sharedByDefault && orgUsers.forEach(user =>
              linkAssetToUser({ assetId: asset.assetId, userId: user.id })
            )
          }
        });

      } */

      update({
        ...organization,
        name: normalizedName,
        customerCrmId,
        customerCrmLink,
        comments,
        organizationAssets: [...assignedAssets].map(asset => ({ ...asset, asset: null })),
      });
    }
    setLoading(false);
  }

  const resetHandler = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setInitialOrg();
    isHaveAccessToOrgList && navigate(AppRoute.OrganizationList);
  };

  useEffect(() => {
    if (isUpdateError) {
      alert((updateError as any).data?.errors);
    }
  }, [isUpdateError]);

  useEffect(() => {
    if (isUpdated) {
      if (isHaveAccessToOrgList) {
        navigate(AppRoute.OrganizationList);
      } else {
        setOptions([]);
        // initOptions();
      }
    }
  }, [isUpdated]);

  useEffect(() => {
    if (organization) {
      setName(organization.name);
      setCustomerID(organization.customerCrmId);
      setAssignedAssets(organization.organizationAssets)
      // ! try change “00000000-0000-0000-0000-000000000000” to orgId and even already assigned assets fail on updating
      // setAssignedAssets([
      //   ...organization.organizationAssets.map((asset) => ({
      //     ...asset,
      //     asset: { ...asset.asset, ownerOrganizationId: organization.id },
      //   })),
      // ]);
    }
  }, [organization]);

  return (
    <form
      className={style.root}
      onSubmit={submitHandler}
      onReset={resetHandler}
      ref={formRef}
    >
      <header className={style.header}>
        <Headline className="edit-organization__title" style={{ margin: 0 }}>
          Edit Organization {organization?.parentOrganization}
        </Headline>
        <div className={style.buttons}>
          <ResetButton
            onClick={({ target }) => (target as HTMLButtonElement).blur()}
          >
            Cancel
          </ResetButton>

          <Button
            type="submit"
            className={style.save}
            disabled={
              isUpdating ||
              externalLoad ||
              Boolean(duplicateOrgError) ||
              Boolean(duplicateIdError)
            }
          >
            Save
          </Button>
        </div>
      </header>

      {isUpdating ||
        externalLoad ||
        loading ||
        isLinkingAsset ||
        !options.length ? (
        <Loader />
      ) : (
        <div className={style.inputs}>
          <Input
            externalSetter={setName}
            value={name}
            label="Org. Name"
            maxLength={64}
            required
            className={style.input}
            error={duplicateOrgError}
          />
          <Input
            externalSetter={setCustomerID}
            value={customerCrmId}
            label="CRM Customer ID"
            maxLength={32}
            className={style.input}
            error={duplicateIdError}
          />

          <Input
            externalSetter={setCustomerLink}
            value={customerCrmLink}
            label="CRM Customer ID Link"
            maxLength={64}
            className={style.input}
          />

          <Multiselect
            options={options}
            label="Org. Assets"
            selected={assignedAssets}
            setSelected={setAssignedAssets}
            errorMessage="Select asset permissions to assign to the organization."
            showError={assetError}
            className={style.input}
            disabled={!isHaveAccessToEditAsset}
            type="edit-organization"
            inputList={[...assignedAssets]
              .map((asset) => asset.asset.name)
              .join(", ")}
          />

          <Input
            externalSetter={setComment}
            value={comments}
            placeholder="Comments"
            label="Comments"
            maxLength={200}
            showLimit
            className={style.input}
          />
        </div>
      )}
    </form>
  );
};

export default EditOrganizationForm;
