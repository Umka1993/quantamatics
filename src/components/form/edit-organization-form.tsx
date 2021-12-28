import Button, { ResetButton } from '../button';
import React, { FormEvent, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Organization } from 'types/organization/types';
import Headline from '../page-title'
import Input, { Multiselect } from '../app-input';

import style from './styles/edit-organization.module.scss'
import { useNavigate } from 'react-router-dom';
import { useUpdateOrganizationMutation } from '../../api/organization';
import Loader from "../loader";
import { AppRoute } from '../../data/enum';
import * as assetsHooks from "../../api/asset";
import { useDispatch, useSelector } from 'react-redux';
import { AssetServerResponse } from '../../types/asset';
import { addAsset } from '../../store/assets';
import { RootState } from 'store';

interface EditOrganizationFormProps {
    organization?: Organization,
    isHaveAccessToOrgList?: boolean,
    externalLoad?: boolean
}

const EditOrganizationForm: FunctionComponent<EditOrganizationFormProps> = ({ organization, isHaveAccessToOrgList, externalLoad }) => {

    const navigate = useNavigate();
    const [update, { isSuccess: isUpdated, isLoading: isUpdating, isError: isUpdateError, error: updateError }] =
        useUpdateOrganizationMutation();

    const dispatch = useDispatch();
    const storedAssets = useSelector((state: RootState) => state.assets)

    useEffect(() => {
        storedAssets.length && setDatasets(storedAssets.map(asset => asset.name))
    }, [storedAssets]);

    const [name, setName] = useState<string>("");
    const [customerCrmId, setCustomerID] = useState<string>("");
    const [customerCrmLink, setCustomerLink] = useState<string>("");
    const [comments, setComment] = useState<string | undefined>("");
    const [datasets, setDatasets] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const { data: assets } = assetsHooks.useGetAllAssetsQuery(organization?.id as string);
    const [deleteAsset, { isLoading: isDeletingAsset }] = assetsHooks.useDeleteAssetsMutation();
    const [createAsset, { isLoading: isCreatingAsset }] = assetsHooks.useCreateAssetsMutation();
    const [updateAsset] = assetsHooks.useUpdateAssetsMutation();
    const [linkAsset, { isLoading: isLinkingAsset }] = assetsHooks.useLinkAssetToOrgMutation();
    const [getAssetInfo] = assetsHooks.useGetAssetByIDMutation();

    const setInitialOrg = useCallback(() => {
        if (organization) {
            setName(organization.name);
            setCustomerID(organization.customerCrmId);
            setCustomerLink(organization.customerCrmLink);
            setComment(organization.comments);
        }
    }, [organization]);

    useEffect(() => {
        if (assets && assets.length) {
            assets.map(async ({ assetId }: { assetId: number }) => {
                await getAssetInfo(assetId).unwrap().then(({ name, id }: AssetServerResponse) => dispatch(addAsset({ id, name })));
            }
            );
        }
    }, [assets])

    useEffect(() => {
        organization && setInitialOrg();
    }, [organization]);


    function submitHandler(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        setLoading(true);
        storedAssets.forEach(asset => {
            /* Delete unselected assets */

            if (datasets.indexOf(asset.name) < 0) {
                deleteAsset(asset.id)
            }

        })

        datasets.forEach(dataset => {
            const foundedAsset = storedAssets.find(asset => asset.name === dataset)

            if (foundedAsset === undefined && organization) {
                createAsset({
                    name: dataset,
                    ownerOrganizationId: organization.id,
                    version: 1
                }).unwrap().then(({ id: assetId }) => linkAsset({ assetId, orgId: organization.id }))


            }

        })



        if (organization &&
            (organization.name !== name ||
                organization.customerCrmId !== customerCrmId ||
                organization.customerCrmLink !== customerCrmLink ||
                organization.comments !== comments)
        ) {
            update({
                ...organization,
                name,
                customerCrmId,
                customerCrmLink,
                comments,
            });
        }



        setLoading(false);
    }

    const resetHandler = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setInitialOrg();
        isHaveAccessToOrgList && navigate(AppRoute.OrganizationList);
    }

    useEffect(() => {
        if (isUpdateError) {
            alert((updateError as any).data?.errors);
        }
    }, [isUpdateError])

    useEffect(() => {
        isUpdated && isHaveAccessToOrgList && navigate(AppRoute.OrganizationList);
    }, [isUpdated]);

    return (<form className={style.root}
        onSubmit={submitHandler}
        onReset={resetHandler}
    >
        <header className={style.header}>
            <Headline className="edit-organization__title" style={{ margin: 0 }}>
                Edit Organization
            </Headline>
            <div className={style.buttons}>
                <ResetButton
                    onClick={
                        ({ target }) => (target as HTMLButtonElement).blur()
                    }
                >
                    Cancel
                </ResetButton>

                <Button
                    type="submit"
                    className={style.save}
                    disabled={isUpdating || externalLoad}
                >
                    Save
                </Button>
            </div>
        </header>

        {(isUpdating || externalLoad || loading || isDeletingAsset || isCreatingAsset || isLinkingAsset) ? <Loader /> : <>
            <Input
                externalSetter={setName}
                value={name}
                label='Org. Name'
                maxLength={64}
                required
                className={style.input}
            />
            <Input
                externalSetter={setCustomerID}
                value={customerCrmId}
                label='CRM Customer ID'
                maxLength={32}
                className={style.input}
            />

            <Input
                externalSetter={setCustomerLink}
                value={customerCrmLink}
                label='CRM Customer ID Link'
                maxLength={64}
                className={style.input}
            />

            <Multiselect
                options={['Coherence', 'Research', 'Backtest - Enterprise', 'Enterprise', 'Backtest - Express', 'Express', 'Backtest - CPG', 'CPG', 'Backtest - Summary v3.1', 'Summary v3.1']}
                label='Org. Datasets'
                selected={datasets}
                setSelected={setDatasets}
            />

            <Input
                externalSetter={setComment}
                value={comments}
                placeholder="Comments"
                label='Comments'
                maxLength={200}
                showLimit
                className={style.input}
            />
        </>}


    </form>);
}

export default EditOrganizationForm;