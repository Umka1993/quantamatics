import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./base/";

/**
 * {@link https://qmc-api.k8s.dev.quantamatics.net/swagger/index.html | All routes}
 */

const api = createApi({
	reducerPath: "quantamaticsApi",
	baseQuery,
	tagTypes: ["Organizations", "Users", "Assets"],

	endpoints: (_build) => ({
	}),
});

export default api;
