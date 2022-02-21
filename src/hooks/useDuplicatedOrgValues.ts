import { UniqueError } from "../data/enum";
import {
    RefObject,
    useEffect,
    useState,
    Dispatch,
    SetStateAction,
} from "react";
import { useGetAllOrganizationsQuery } from "../api/organization";
import normalizeName from "../services/normalize-name";

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

    const [checkNameTrigger, setCheckNameTrigger] = useState(false);

    useEffect(() => {
        duplicateOrgError && formRef.current?.reportValidity();
    }, [duplicateOrgError, formRef.current]);

    useEffect(() => {
        duplicateIdError && formRef.current?.reportValidity();
    }, [duplicateIdError, formRef.current]);

    useEffect(() => {
        if (checkNameTrigger) {
            duplicateOrgError && setDuplicateOrgError(undefined);
            setCheckNameTrigger(false);
        }
    }, [name]);

    useEffect(() => {
        duplicateOrgError && setCheckNameTrigger(true);
    }, [duplicateOrgError]);

    useEffect(() => {
        customerCrmId && setDuplicateIdError(undefined);

        // Remove spaces from CRM ID
        setCustomerCrmId(customerCrmId.replace(/\s/g, ""));
    }, [customerCrmId]);

    function checkNameDuplicate(): boolean {
        const normalizedName = normalizeName(name);
        normalizedName !== name && setName(normalizedName);

        const duplicatedOrganization = allOrganizations?.find(
            (org) =>
                org.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase()
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
