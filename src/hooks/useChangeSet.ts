import { Dispatch, SetStateAction } from "react";

export default function useChangeSet<V>(
    value: V,
    stateSetter: Dispatch<SetStateAction<Set<V>>>
) {
    const addAssetIdToState = (prevSet: Set<V>) => new Set([...prevSet, value]);
    const removeAssetIdFromState = (prevSet: Set<V>) =>
        new Set([...prevSet].filter((initialValue) => initialValue !== value));

    const addToSet = () => stateSetter(addAssetIdToState);
    const removeFromSet = () => stateSetter(removeAssetIdFromState);

    return [addToSet, removeFromSet];
}
