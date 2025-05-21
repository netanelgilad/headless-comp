import React from "react";
import { ProductGallerySelectedImage as ProductGallerySelectedImagePrimitive, ProductGalleryThumbnail as ProductGalleryThumbnailPrimitive, NextProductImage as NextProductImagePrimitive, PreviousProductImage as PreviousProductImagePrimitive } from "../headless/ProductGallery/ProductGallery";
import { GridTileImage } from "./GridTileImage";
import type { products } from "@wix/stores";

export const ProductGallerySelectedImage = (props: Omit<React.ComponentProps<typeof ProductGallerySelectedImagePrimitive>, 'children'>) => (
    <ProductGallerySelectedImagePrimitive
        {...props}
    >
        {(selectedImage) => (
            <img
                className="h-full w-full object-contain"
                sizes="(min-width: 1024px) 66vw, 100vw"
                loading={"eager"}
                alt={selectedImage.image?.altText!}
                src={selectedImage.image?.url}
            />
        )}
    </ProductGallerySelectedImagePrimitive>
);
ProductGallerySelectedImage.displayName = "ProductGallerySelectedImage";

export const ProductGalleryThumbnail = (props: Omit<React.ComponentProps<typeof ProductGalleryThumbnailPrimitive>, 'children'>) => (
    <ProductGalleryThumbnailPrimitive
        {...props}
    >
        {(image: products.MediaItem, isActive: boolean, selectImage: () => void) => (
            <li className="h-20 w-20">
                <input
                    type="radio"
                    name="image"
                    form="view-selections"
                    onChange={selectImage}
                    checked={isActive}
                    value={props.index}
                    aria-label="Select product image"
                    className="hidden peer"
                />
                <label onClick={selectImage}>
                    <span className="sr-only">View product image {props.index + 1}</span>
                    <GridTileImage
                        alt={image.image!.altText!}
                        src={image.image!.url!}
                        width={80}
                        height={80}
                        active={isActive}
                        loading="eager"
                    />
                </label>
            </li>
        )}
    </ProductGalleryThumbnailPrimitive>
);
ProductGalleryThumbnail.displayName = "ProductGalleryThumbnail";

export const NextProductImage = (props: Omit<React.ComponentProps<typeof NextProductImagePrimitive>, 'children'>) => (
    <NextProductImagePrimitive
        {...props}
    >
        {(nextImage: () => void) => (
            <button aria-label="Next product image" 
                className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center" 
                onClick={nextImage}
            >
                <label>
                    <span className="sr-only">Next product image</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                    </svg>
                </label>
            </button>
        )}
    </NextProductImagePrimitive>
);
NextProductImage.displayName = "NextProductImage";

export const PreviousProductImage = (props: Omit<React.ComponentProps<typeof PreviousProductImagePrimitive>, 'children'>) => (
    <PreviousProductImagePrimitive
        {...props}
    >
        {(previousImage: () => void) => (
            <button aria-label="Previous product image" 
                className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center" 
                onClick={previousImage}
            >
                <label>
                    <span className="sr-only">Previous product image</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                    </svg>
                </label>
            </button>
        )}
    </PreviousProductImagePrimitive>
);
PreviousProductImage.displayName = "PreviousProductImage";