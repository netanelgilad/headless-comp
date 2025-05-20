import { atom } from "nanostores";

export function createSelectedVariantStore(initialSelectedOptions: Record<string, string>) {
    const $selectedOptions = atom<Record<string, string>>(initialSelectedOptions);

    return {
        $selectedOptions,
        setSelectedOptions: (selectedOptions: Record<string, string>) => {
            $selectedOptions.set(selectedOptions);
        }
    }
}