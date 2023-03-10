import { useGetOrganizationQuery } from "../api/organization";
import { useParams } from "react-router";
import { RouteParams } from "../types/route-params";


function useGetOrganizationFromURL() {
	const { id } = useParams<RouteParams>();
	const organizationReturnQuery = useGetOrganizationQuery(id as string);
	return organizationReturnQuery;
}

export default useGetOrganizationFromURL;
