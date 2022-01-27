import { UniqueError } from "../data/enum";
import { RefObject, useEffect, useState } from "react";
import { useGetAllOrganizationsQuery } from "../api/organization";



export default function useDuplicatedOrgValues(
    formRef: RefObject<HTMLFormElement>,
    name: string,
    customerCrmId: string
) {
    const { data: allOrganizations } = useGetAllOrganizationsQuery();

    const [duplicateOrgError, setDuplicateOrgError] = useState<
        undefined | UniqueError.Name
    >(undefined);
    const [duplicateIdError, setDuplicateIdError] = useState<
        undefined | UniqueError.ID
    >(undefined);

    useEffect(() => {
        duplicateOrgError && formRef.current?.reportValidity();
    }, [duplicateOrgError, formRef.current]);

    useEffect(() => {
        duplicateIdError && formRef.current?.reportValidity();
    }, [duplicateIdError, formRef.current]);

    useEffect(() => {
        duplicateOrgError && setDuplicateOrgError(undefined);
    }, [name]);

    useEffect(() => {
        customerCrmId && setDuplicateIdError(undefined);
    }, [customerCrmId]);

    function checkNameDuplicate(): boolean {
        const duplicatedOrganization = allOrganizations?.find(
            (org) => org.name.toLocaleLowerCase() === name.toLocaleLowerCase()
        );
        if (duplicatedOrganization) {
            setDuplicateOrgError(UniqueError.Name);
            return true;
        } else {
            return false;
        }
    }

    function checkIdDuplicate(): boolean {
        if (customerCrmId.length) {
            const duplicatedOrganization = allOrganizations?.find(
                (org) => org.customerCrmId === customerCrmId
            );
            if (duplicatedOrganization) {
                setDuplicateIdError(UniqueError.ID);
                return true;
            }
        }

        return false;
    }

    return [
        duplicateOrgError,
        duplicateIdError,
        checkNameDuplicate,
        checkIdDuplicate,
    ] as const;
}
