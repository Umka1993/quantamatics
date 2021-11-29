import { createOrganizationRequestBody } from "../../components/form/create-organization";
import { Organization } from "types/organization/types";
import { ApiRoute } from "../../data/enum";
import baseApi from "../index";

const accountApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        registerUser: build.mutation({
            query: (body: any) => ({
                url: ApiRoute.RegisterUser,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Users", id: "list" }],
        }),
    })
})

export const {
    useRegisterUserMutation
} = accountApi;
