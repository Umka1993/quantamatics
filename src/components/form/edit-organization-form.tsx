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

interface EditOrganizationFormProps {
    organization?: Organization,
    isHaveAccessToOrgList?: boolean,
    externalLoad?: boolean
}

const EditOrganizationForm: FunctionComponent<EditOrganizationFormProps> = ({ organization, isHaveAccessToOrgList, externalLoad }) => {

    const navigate = useNavigate();
    const [update, { isSuccess: isUpdated, isLoading: isUpdating, isError: isUpdateError, error: updateError }] =
        useUpdateOrganizationMutation();

    const [name, setName] = useState<string>("");
    const [customerCrmId, setCustomerID] = useState<string>("");
    const [customerCrmLink, setCustomerLink] = useState<string>("");
    const [comments, setComment] = useState<string | undefined>("");
    const [datasets, setDatasets] = useState<string[]>([]);

    const { data: assets } = assetsHooks.useGetAllAssetsQuery(organization?.id as string);
    const [deleteAsset] = assetsHooks.useDeleteAssetsMutation();
    const [createAsset] = assetsHooks.useCreateAssetsMutation();
    const [updateAsset] = assetsHooks.useUpdateAssetsMutation();
    const [linkAsset] = assetsHooks.useLinkAssetToOrgMutation();
    const [getAssetInfo, { data: asset }] = assetsHooks.useGetAssetByIDMutation();

    const setInitialOrg = useCallback(() => {
        if (organization) {
            setName(organization.name);
            setCustomerID(organization.customerCrmId);
            setCustomerLink(organization.customerCrmLink);
            setComment(organization.comments);
        }

    }, [organization]);

    const addDataset = useCallback((newDataset: string) => setDatasets([...datasets, newDataset]), [setDatasets, datasets])

    useEffect(() => {
        const tempArray: string[] = [];
        if (assets && assets.length) {
            assets.map(async ({ assetId }: any, index: number) => {
                const res = await getAssetInfo(assetId).unwrap().then(({ name }: any) => name);

                setTimeout(() => {
                    
                    console.log(res);
                    console.log(datasets);
                    console.log(index);

                    setDatasets([...datasets, res ])


                }, 400 * (index + 1))
                // console.log(res);

            }
            );

        }

        console.log(tempArray);

        // tempArray.length && setDatasets(tempArray)

    }, [assets])

    /*  useEffect(() => {
        asset && console.log(asset);
     
         // isSuccess && asset && setDatasets([...datasets].push(asset.id))
     }, [asset]) */

    useEffect(() => {
        organization && setInitialOrg();
    }, [organization]);


    function submitHandler(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        update({
            ...organization,
            name,
            customerCrmId,
            customerCrmLink,
            comments
        });
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

        {(isUpdating || externalLoad) ? <Loader /> : <>
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