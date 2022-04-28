import {
	FormEvent,
	useCallback,
	useEffect,
	useState,
	useTransition,
} from "react";

export default function useFilterToSearchQuery<Item>(
	initialItems: Item[],
	getFilterFunction: (query: string) => (item: Item) => boolean
) {
	const [query, setSearchQuery] = useState("");
	const [isFiltering, startFiltering] = useTransition();
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
			const filtered = query.length
				? filterOrganizationsToQuery(query)
				: initialItems;
			setFilteredItems(filtered);
		}
	}, [query, initialItems]);

	function inputHandler(evt: FormEvent<HTMLLabelElement>) {
		const input = evt.target;
		const { value } = input as HTMLInputElement;

		startFiltering(() => {
			setSearchQuery(value);
		});
	}

	return {
		searchQuery: query,
		filteredItems,
		inputHandler,
		isFiltering,
	};
}
