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
import { useUpdateOrganizationMutation } from "../../api/organization";
import Loader from "../loader";
import { AppRoute, UserRole } from "../../data/enum";
import * as assetsHooks from "../../api/asset";
import useDuplicatedOrgValues from "../../hooks/useDuplicatedOrgValues";
import { AssetListItem } from "../../types/asset";
import useUser from "../../hooks/useUser";
import normalizeName from "../../services/normalize-name";
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

  const isHaveAccessToEditAsset =
    user?.userRoles.includes(UserRole.OrgOwner) ||
    user?.userRoles.includes(UserRole.Admin);

  const [name, setName] = useState<string>("");
  const [customerCrmId, setCustomerID] = useState<string>("");
  const [customerCrmLink, setCustomerLink] = useState<string>("");
  const [comments, setComment] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const [assignedAssets, setAssignedAssets] = useState<Set<string | number>>(
    new Set()
  );
  const [initialSelectedAssets, setInitialSelectedAssets] = useState<
    Set<string | number>
  >(new Set());

  const [assetsToUpdateShared, setAssetsToUpdateShared] = useState<
    Set<string | number>
  >(new Set());

  const formRef = useRef<HTMLFormElement>(null);

  const [
    duplicateOrgError,
    duplicateIdError,
    checkNameDuplicate,
    checkIdDuplicate,
  ] = useDuplicatedOrgValues(formRef, name, customerCrmId, setName, setCustomerID);

  const [loadOrgAssets] = assetsHooks.useGetAllAssetsOrgMutation();

  const [toggleAssetShared] = assetsHooks.useToggleAssetSharedMutation();

  const [options, setOptions] = useState<AssetListItem[]>([]);

  // init options
  function initOptions() {
    if (organization && user) {
      loadOrgAssets(organization.id)
        .unwrap()
        .then((selectedAssets) => {
          const onlySharedAssets = selectedAssets.filter(
            ({ sharedByDefault }) => sharedByDefault
          );

          const selectedAssetsIDs = new Set(
            selectedAssets.map(({ assetId }) => assetId)
          );

          setInitialSelectedAssets(selectedAssetsIDs);

          setAssignedAssets(selectedAssetsIDs);

          const prepareOptions = (allAssets: AssetListItem[]) =>
            setOptions(
              [...allAssets].map((asset) => ({
                ...asset,
                sharedByDefault:
                  onlySharedAssets.findIndex(
                    ({ assetId }) => assetId === asset.assetId
                  ) !== -1,
              }))
            );

          // check if organization has some assets that parent org doesn't has
          organization.parentId &&
            loadOrgAssets(organization.parentId)
              .unwrap()
              .then((allAssets) => {
                selectedAssetsIDs.forEach(
                  (assetId) =>
                    allAssets.findIndex(
                      (asset) => asset.assetId === assetId
                    ) === -1 && unlinkAsset({ assetId, orgId: organization.id })
                );

                organization.parentId === user.organizationId &&
                  prepareOptions(allAssets);
              });

          // Prepare data for multiselect
          organization.parentId !== user.organizationId;
          loadOrgAssets(user?.organizationId as string)
            .unwrap()
            .then((allAssets) => prepareOptions(allAssets));
        });
    }
  }

  useEffect(initOptions, [organization, user]);

  const [linkAsset, { isLoading: isLinkingAsset }] =
    assetsHooks.useLinkAssetToOrgMutation();

  const [unlinkAsset, { isLoading: isUnLinking }] =
    assetsHooks.useUnlinkAssetToOrgMutation();

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

    if (!assignedAssets.size) {
      setAssetError(true);
      return setLoading(false);
    }
    let duplicate = false;

    if (normalizeName(name) !== organization?.name) {
      duplicate = checkNameDuplicate();
    }

    if (customerCrmId !== organization?.customerCrmId) {
      duplicate = checkIdDuplicate() || duplicate;
    }

    if (duplicate) {
      return setLoading(false);
    }

    if (organization) {
      const orgId = organization.id;
      /* Unlink unselected assets */
      initialSelectedAssets.forEach((assetId) => {
        !assignedAssets.has(assetId) && unlinkAsset({ assetId, orgId });
      });

      /* Link new assets */
      assignedAssets.forEach((assetId) => {
        /* Toggle only selected values (unselected toggled to false on backend) */
        const toggleShareByDefaultIfSelected = () => {
          if (assetsToUpdateShared.has(assetId))
            toggleAssetShared({ assetId, passedOrgID: organization.id });
        };

        /* Toggle after linking, if asset already linking order doesn't matter  */
        if (initialSelectedAssets.has(assetId)) {
          toggleShareByDefaultIfSelected();
        } else {
          linkAsset({
            assetId,
            orgId,
          })
            .unwrap()
            .then(() => toggleShareByDefaultIfSelected());
        }

        setAssetsToUpdateShared(new Set([]));
      });

      update({
        ...organization,
        name,
        customerCrmId,
        customerCrmLink,
        comments,

        organizationAssets: options,
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
        initOptions();
      }
    }
  }, [isUpdated]);


  useEffect(
    () => {
      if (organization) {
        setName(organization.name)
        setCustomerID(organization.customerCrmId)
      }
    },
    [organization]
  );

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
            assetsToUpdateShared={assetsToUpdateShared}
            setAssetsToUpdateShared={setAssetsToUpdateShared}
            disabled={!isHaveAccessToEditAsset}
            type="edit-organization"
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
