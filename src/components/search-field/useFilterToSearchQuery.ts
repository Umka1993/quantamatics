import { FormEvent, useCallback, useDeferredValue, useEffect, useState } from "react";

export default function useFilterToSearchQuery<Item>(
	initialItems: Item[],
	getFilterFunction: (query: string) => (item: Item) => boolean
) {
	const [search, setSearch] = useState("");
	const deferredSearch = useDeferredValue(search);
	const [filteredItems, setFilteredItems] = useState<Item[]>(initialItems);

	const filterOrganizationsToQuery = useCallback(
		(query: string) => {
			const normalizedSearchQuery = query.toLocaleLowerCase();
			return initialItems.filter(getFilterFunction(normalizedSearchQuery));
		},
		[initialItems]
	);

	useEffect(() => {
		if (initialItems) {
			const filtered = deferredSearch.length
				? filterOrganizationsToQuery(deferredSearch)
				: initialItems;
			setFilteredItems(filtered);
			sessionStorage.setItem("table-rows", JSON.stringify(filtered));
		}
	}, [deferredSearch, initialItems]);

	function inputHandler(evt: FormEvent<HTMLLabelElement>) {
		const input = evt.target;
		const { value } = input as HTMLInputElement;

		setSearch(value);
	}

	return { deferredSearch, setSearch, filteredItems, setFilteredItems, inputHandler };
}
