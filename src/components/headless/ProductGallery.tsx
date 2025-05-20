import { useStore } from "@nanostores/react";
import { GridTileImage } from "./GridTileImage";
import type { createProductGalleryStore } from "./ProductGalleryStore";
import { getStore } from "./StoreManager";

await new Promise(resolve => setTimeout(resolve, 1000))

export function ProductGallerySelectedImage(props: {
    productGalleryStoreId: string & ReturnType<typeof createProductGalleryStore>
}) {
    const { $selectedImage } = getStore(props.productGalleryStoreId);
    const selectedImage = useStore($selectedImage);

    return (
        selectedImage && (
            <img
                className="h-full w-full object-contain"
                sizes="(min-width: 1024px) 66vw, 100vw"
                loading={"eager"}
                alt={selectedImage.image?.altText!}
                src={selectedImage.image?.url}
            />
        )
    )
}

export function ProductGalleryThumbnail(props: {
    index: number,
    productGalleryStoreId: string & ReturnType<typeof createProductGalleryStore>
}) {
    const { $imageIndex, selectImage, getImageByIndex } = getStore(props.productGalleryStoreId);
    const imageIndex = useStore($imageIndex);

    const isActive = imageIndex === props.index;

    return (
        <li className="h-20 w-20">
            <input
                type="radio"
                name="image"
                form="view-selections"
                onChange={() => selectImage(props.index)}
                checked={isActive}
                value={props.index}
                aria-label="Select product image"
                className="hidden peer"
            />
            <label>
                <span className="sr-only">View product image {props.index + 1}</span>
                <GridTileImage
                    alt={getImageByIndex(props.index)!.image!.altText!}
                    src={getImageByIndex(props.index)!.image!.url!}
                    width={80}
                    height={80}
                    active={isActive}
                    loading="eager"
                />
            </label>
        </li>
    );
}