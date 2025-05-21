import { atom, computed, onMount } from "nanostores";
import { products } from "@wix/stores";
import type { createSelectedVariantStore } from "../VariantSelector/VariantSelectorStore";
import { getStore, registerStore } from "../StoreManager";

export type ProductGalleryStoreInput = {
    media: NonNullable<products.Product['media']>,
    selectedVariantStoreId: string & ReturnType<typeof createSelectedVariantStore>
};

export function createProductGalleryStore(input: any) {
    console.log("createProductGalleryStore", input);
    debugger;
    const { media } = input;
    const $imageIndex = atom<number>(0);
    
    const { input: selectedVariantStoreInput } = getStore(input.dependantStoreIds.selectedVariantStoreId);
    onMount($imageIndex, () => {
        return getStore(input.dependantStoreIds.selectedVariantStoreId).$selectedOptions.subscribe(selectedOptions => {
            Object.entries(selectedOptions).find(([key, value]) => {
                const productOption = selectedVariantStoreInput.productOptions!.find(productOption => productOption.name === key);

                if (productOption) {
                    const optionChoice = productOption.choices!.find(optionChoice =>
                        (productOption.optionType === products.OptionType.color ?
                            optionChoice.description :
                            optionChoice.value)
                        === value);

                    if (optionChoice) {
                        const imageIndex = media?.items!.findIndex(productImage => {
                            return productImage._id === optionChoice.media?.mainMedia?._id
                        }
                        );

                        if (typeof imageIndex !== 'undefined' && imageIndex !== -1) {
                            $imageIndex.set(imageIndex);
                        }
                    }
                }
            });
        });
    });

    return {
        $imageIndex,
        $selectedImage: computed($imageIndex, (imageIndex) => media.items![imageIndex]),
        selectImage: (imageIndex: number) => {
            $imageIndex.set(imageIndex);
        },
        previousImage: () => {
            const previousImageIndex =
                $imageIndex.get() === 0 ? media.items!.length - 1 : $imageIndex.get() - 1;
            $imageIndex.set(previousImageIndex);
        },
        nextImage: () => {
            const nextImageIndex =
                $imageIndex.get() === media.items!.length - 1 ? 0 : $imageIndex.get() + 1;
            $imageIndex.set(nextImageIndex);
        },
        getImageByIndex: (index: number) => media.items![index]
    }
}

registerStore("productGallery", createProductGalleryStore);