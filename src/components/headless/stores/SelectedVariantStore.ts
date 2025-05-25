import type { products } from "@wix/stores";
import { atom, computed } from "nanostores";
import type { createCurrentCartStore } from "./CurrentCartStore";
import { getStore, registerStore } from "../StoreManager";
import { getVariants } from "../VariantSelector/VariantSelector";

export type SelectedVariantStoreInput = 
    Pick<products.Product, 
    'productOptions' | 'manageVariants' | 'variants' | 'name' | 'priceData' | 'stock' | '_id'> & {
        currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>
    }

export function createSelectedVariantStore(input: SelectedVariantStoreInput) {
    const $selectedOptions = atom<Record<string, string>>({});
    const { addToCart } = getStore(input.currentCartStoreId);
    const variants = getVariants(input)!;

    return {
        input,
        $selectedOptions,
        $isAvailableForSale: computed($selectedOptions,(selectedOptions) => {
            const variant = variants.find(variant => 
                variant.selectedOptions.every(({name, value}) => selectedOptions[name!] === value)
            );

            return variant?.availableForSale;
        }),
        setSelectedOptions: (selectedOptions: Record<string, string>) => {
            $selectedOptions.set(selectedOptions);
        },
        addSelectedVariantToCart: async () => {
            await addToCart({
                lineItems: [{
                    catalogReference: {
                        catalogItemId: input._id!,
                        appId: "1380b703-ce81-ff05-f115-39571d94dfcd",
                        options: {
                            options: $selectedOptions.get(),
                        }
                    },
                    quantity: 1,
                }]
            });
        }
    }
}

registerStore("selectedVariant", createSelectedVariantStore);