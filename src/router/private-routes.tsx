import { AppRoute, UserRole } from "../data/enum";
import { ReactElement } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import useUser from "../hooks/useUser";
import { JupyterFrame } from "../components/jupyter-frame";
import OrganizationList from "../components/organization-list";
import { CreateOrganizationForm, AddUserForm } from "../components/form/";
import { EditOrganization } from "../components/edit-organization/edit-organization";
import SuccessMessage from "../components/success-message";

export default function PrivateRoutes(): ReactElement {
	const user = useUser();

	const isOrganizationsAvailable =
		user &&
		(user.userRoles.includes(UserRole.Admin) ||
			user.userRoles.includes(UserRole.OrgOwner));

	const isEditOrgAvailable =
		isOrganizationsAvailable || user?.userRoles.includes(UserRole.OrgAdmin);

	const HomePath = user.allowResearch
		? AppRoute.Files
		: user.allowCoherence
			? AppRoute.Coherence
			: user.allowExcelLibrary
				? AppRoute.ExcelLibrary
				: isOrganizationsAvailable
					? AppRoute.OrganizationList
					: isEditOrgAvailable
						? `/apps/organizations/${user?.organizationId}`
						: "/demo";

	return (
		<Routes>
			<Route path="*" element={<Navigate to={HomePath} />} />
			<Route path="/demo" element={<h1>Demo Page</h1>} />
			{user.allowResearch && (
				<Route path={AppRoute.Files} element={<JupyterFrame type="files" />} />
			)}

			{user.allowCoherence && (
				<Route
					path={AppRoute.Coherence}
					element={<JupyterFrame type="coherence" />}
				/>
			)}

			{user.allowExcelLibrary && (
				<Route
					path={AppRoute.ExcelLibrary}
					element={<JupyterFrame type="excelLibrary" />}
				/>
			)}

			{isOrganizationsAvailable && (
				<>
					<Route
						path={AppRoute.OrganizationList}
						element={<OrganizationList />}
					/>
					<Route
						path={AppRoute.CreateOrganization}
						element={<CreateOrganizationForm />}
					/>
				</>
			)}

			{isEditOrgAvailable && (
				<>
					<Route path={AppRoute.Organizations} element={<EditOrganization />} />
					<Route
						path={AppRoute.Organizations + "/add-user"}
						element={<AddUserForm />}
					/>
					<Route path={AppRoute.Success} element={<SuccessMessage />} />
				</>
			)}
		</Routes>
	);
}
