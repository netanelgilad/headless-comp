import { ProductOptionChoice as ProductOptionChoiceHeadless } from "../headless/ProductOptionChoice";
import type { createSelectedVariantStore } from "../headless/SelectedVariantStore";
import type { products } from "@wix/stores";
import clsx from "clsx";

export function ProductOptionChoice(props: {
    option: products.ProductOption,
    choice: products.Choice,
    selectedVariantStoreId: string & ReturnType<typeof createSelectedVariantStore>,
}) {
    return (
        <ProductOptionChoiceHeadless
            option={props.option}
            choice={props.choice}
            selectedVariantStoreId={props.selectedVariantStoreId}
            className={({ isActive, isAvailableForSale }) => (
                clsx(
                    "flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900",
                    {
                        "cursor-default ring-2 ring-blue-600": isActive,
                        "ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-blue-600":
                            !isActive && isAvailableForSale,
                        "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700":
                            !isAvailableForSale,
                    }
                )
            )}
        />
    );
}
