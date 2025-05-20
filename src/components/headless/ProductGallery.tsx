import { products } from "@wix/stores";
import { useEffect, useState } from "react";
import type { createSelectedVariantStore } from "./SelectedVariantStore";
import { getStore } from "./StoreManager";
import { GridTileImage } from "./GridTileImage";

await new Promise(resolve => setTimeout(resolve, 1000));

export function ProductGallery(props: {
    product: products.Product,
    selectedVariantStoreId: string & ReturnType<typeof createSelectedVariantStore>
}) {
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        return getStore(props.selectedVariantStoreId).$selectedOptions.subscribe(selectedOptions => {
            Object.entries(selectedOptions).find(([key, value]) => {
                const productOption = props.product.productOptions!.find(productOption => productOption.name === key);

                if (productOption) {
                    const optionChoice = productOption.choices!.find(optionChoice =>
                        (productOption.optionType === products.OptionType.color ?
                            optionChoice.description :
                            optionChoice.value)
                        === value);

                    if (optionChoice) {
                        const imageIndex = props.product.media?.items!.findIndex(productImage => {
                            console.log('comparing', productImage._id, optionChoice.media?.mainMedia?._id);
                            return productImage._id === optionChoice.media?.mainMedia?._id
                        }
                        );

                        if (typeof imageIndex !== 'undefined' && imageIndex !== -1) {
                            setImageIndex(imageIndex);
                        }
                    }
                }
            });
        });
    }, [props.product.media?.items]);

    const nextImageIndex =
        imageIndex + 1 < props.product.media!.items!.length ? imageIndex + 1 : 0;
    const previousImageIndex =
        imageIndex === 0 ? props.product.media!.items!.length - 1 : imageIndex - 1;

    const buttonClass =
        "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center";

    return (
        <>
            <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
                {
                    props.product.media?.items![imageIndex] && (
                        <img
                            className="h-full w-full object-contain"
                            sizes="(min-width: 1024px) 66vw, 100vw"
                            loading={"eager"}
                            alt={props.product.media!.items![imageIndex]?.image?.altText!}
                            src={props.product.media!.items![imageIndex]?.image?.url}
                        />
                    )
                }

                {
                    props.product.media!.items!.length > 1 ? (
                        <div className="absolute bottom-[15%] flex w-full justify-center">
                            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
                                <button aria-label="Previous product image" className={buttonClass} onClick={() => setImageIndex(previousImageIndex)}>
                                    <label>
                                        <span className="sr-only">Previous product image</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            className="size-6 h-5"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                                            />
                                        </svg>
                                    </label>
                                </button>
                                <div className="mx-1 h-6 w-px bg-neutral-500" />
                                <button aria-label="Next product image" className={buttonClass} onClick={() => setImageIndex(nextImageIndex)}>
                                    <label>
                                        <span className="sr-only">Next product image</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            className="size-6 h-5"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                            />
                                        </svg>
                                    </label>
                                </button>
                            </div>
                        </div>
                    ) : null
                }
            </div>

            {
                props.product.media!.items!.length > 1 ? (
                    <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
                        {props.product.media!.items!.map((image, index) => {
                            const isActive = index === imageIndex;

                            return (
                                <li className="h-20 w-20">
                                    <label onClick={() => setImageIndex(index)}>
                                        <span className="sr-only">View product image {index + 1}</span>
                                        <GridTileImage
                                            alt={image.image?.altText!}
                                            src={image.image?.url!}
                                            width={80}
                                            height={80}
                                            active={isActive}
                                            loading="eager"
                                        />
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                ) : null
            }

        </>
    )
}