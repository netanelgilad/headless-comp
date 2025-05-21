import clsx from "clsx";
import React from "react";
import { ProductOptionChoice as ProductOptionChoiceHeadless } from "../headless/VariantSelector/VariantSelector";

export function ProductOptionChoice(props: Omit<React.ComponentProps<typeof ProductOptionChoiceHeadless>, 'children'>) {
    return (
        <ProductOptionChoiceHeadless
            option={props.option}
            choice={props.choice}
            selectedVariantStoreId={props.selectedVariantStoreId}
        >
            {({ isActive, isAvailableForSale, optionName, choiceValue, handleSelect }) => (
                <>
                    <input
                        type="radio"
                        aria-disabled={!isAvailableForSale}
                        disabled={!isAvailableForSale}
                        checked={isActive}
                        name={optionName}
                        value={choiceValue}
                        title={`${props.option.name} ${choiceValue}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                        onChange={handleSelect}
                        className="hidden peer"
                    />
                    <label
                        onClick={handleSelect}
                        data-active={isActive ? "" : undefined}
                        data-available-for-sale={isAvailableForSale ? "" : undefined}
                        className={clsx(
                            "flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900",
                            {
                                "cursor-default ring-2 ring-blue-600": isActive,
                                "ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-blue-600":
                                    !isActive && isAvailableForSale,
                                "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700":
                                    !isAvailableForSale,
                            }
                        )}
                    >
                        {props.choice.description}
                    </label>
                </>
            )}
        </ProductOptionChoiceHeadless>
    );
} 