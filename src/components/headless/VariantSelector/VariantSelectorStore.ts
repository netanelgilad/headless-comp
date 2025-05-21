import type { products } from "@wix/stores";
import { atom } from "nanostores";

export type SelectedVariantStoreInput = 
    Pick<products.Product, 
    'productOptions' | 'manageVariants' | 'variants' | 'name' | 'priceData' | 'stock'>;

export function createSelectedVariantStore(input: SelectedVariantStoreInput) {
    const $selectedOptions = atom<Record<string, string>>({});

    return {
        input,
        $selectedOptions,
        setSelectedOptions: (selectedOptions: Record<string, string>) => {
            $selectedOptions.set(selectedOptions);
        },
    }
}