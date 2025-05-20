import type { createProductGalleryStore } from "./ProductGalleryStore"
import { getStore } from "./StoreManager";

await new Promise(resolve => setTimeout(resolve, 1000));

export function PreviousProductImage(props: {
    productGalleryStoreId: string & ReturnType<typeof createProductGalleryStore>
}) {
    const productGalleryStore = getStore(props.productGalleryStoreId);

    const buttonClass =
        "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center";

    return (
        <button aria-label="Previous product image" className={buttonClass} onClick={() => productGalleryStore.previousImage()}>
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
    )
}