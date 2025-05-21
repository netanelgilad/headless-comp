import { useStore } from "@nanostores/react";
import type { createProductGalleryStore } from "./ProductGalleryStore";
import { getStore } from "./StoreManager";
import type { products } from "@wix/stores";

export const ProductGallerySelectedImage = (props: {
    productGalleryStoreId: string & ReturnType<typeof createProductGalleryStore>,
    children: (selectedImage: products.MediaItem) => React.ReactNode
}) => {
    const { $selectedImage } = getStore(props.productGalleryStoreId);
    const selectedImage = useStore($selectedImage);

    return (
        selectedImage && (props.children(selectedImage))
    )
}
ProductGallerySelectedImage.displayName = "ProductGallerySelectedImage";

export function ProductGalleryThumbnail(props: {
    index: number,
    productGalleryStoreId: string & ReturnType<typeof createProductGalleryStore>,
    children: (image: products.MediaItem, isActive: boolean, selectImage: () => void) => React.ReactNode
}) {
    const { $imageIndex, selectImage, getImageByIndex } = getStore(props.productGalleryStoreId);
    const imageIndex = useStore($imageIndex);

    const isActive = imageIndex === props.index;
    const image = getImageByIndex(props.index)!;
    const handleSelectImage = () => selectImage(props.index);

    return props.children(image, isActive, handleSelectImage);
}

export function NextProductImage(props: {
    productGalleryStoreId: string & ReturnType<typeof createProductGalleryStore>,
    children: (nextImage: () => void) => React.ReactNode
}) {
    const productGalleryStore = getStore(props.productGalleryStoreId);
    const handleNextImage = () => productGalleryStore.nextImage();

    return props.children(handleNextImage);
}

export function PreviousProductImage(props: {
    productGalleryStoreId: string & ReturnType<typeof createProductGalleryStore>,
    children: (previousImage: () => void) => React.ReactNode
}) {
    const productGalleryStore = getStore(props.productGalleryStoreId);
    const handlePreviousImage = () => productGalleryStore.previousImage();

    return props.children(handlePreviousImage);
}