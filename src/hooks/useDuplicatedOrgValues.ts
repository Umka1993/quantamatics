import { UniqueError } from "../data/enum";
import { RefObject, useEffect, useState, Dispatch, SetStateAction } from "react";
import { useGetAllOrganizationsQuery } from "../api/organization";


export default function useDuplicatedOrgValues(
    formRef: RefObject<HTMLFormElement>,
    name: string,
    customerCrmId: string,
    setName: Dispatch<SetStateAction<string>>,
    setCustomerCrmId: Dispatch<SetStateAction<string>>
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
        // Delete spaces from start and end string. 
        setName(name.trim())
    }, [name]);

    useEffect(() => {
        customerCrmId && setDuplicateIdError(undefined);

        // Remove spaces from CRM ID
        setCustomerCrmId(customerCrmId.replace(/\s/g, ""));
    }, [customerCrmId]);



    /** 
     * Duplicate spaces transform to one
    */
    function prepareStringToCompare(string: string) : string {
        return string.toLocaleLowerCase().replace(/\s\s+/g, ' ')
    }

    function checkNameDuplicate(): boolean {
        const duplicatedOrganization = allOrganizations?.find(
            (org) => prepareStringToCompare(org.name) === prepareStringToCompare(name)
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
