import "./sass/global.scss";
import { BrowserRouter } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";
import BaseLayout from "./layouts";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root") as Element);

root.render(
	<BrowserRouter>
		<Provider store={store}>
			<BaseLayout />
		</Provider>
	</BrowserRouter>
);
