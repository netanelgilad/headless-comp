import { useStore } from "@nanostores/react";
import { products } from "@wix/stores";
import clsx from "clsx";
import type { createSelectedVariantStore } from "./SelectedVariantStore";
import { getStore } from "./StoreManager";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector(props: {
  product: products.Product,
  selectedVariantStoreId: string & ReturnType<typeof createSelectedVariantStore>
}) {
  const selectedVariantStore = getStore(props.selectedVariantStoreId);
  const selectedOptions = useStore(selectedVariantStore.$selectedOptions);

  const productOptions = props.product.productOptions;

  const hasNoOptionsOrJustOneOption =
    !productOptions?.length ||
    (productOptions.length === 1 &&
      productOptions[0]?.choices?.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = getVariants(props.product)?.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name ?? ""]: option.value,
      }),
      {}
    ),
  })) ?? [];

  return (
    productOptions.map((option) => (
      <dl className="mb-8" key={option.name}>
        <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
        <dd className="flex flex-wrap gap-3">
          {option.choices?.map(({ value, description }) => {
            const optionNameLowerCase = option.name!;

            // Base option params on current selectedOptions so we can preserve any other param state.
            const optionParams = { ...selectedOptions, [optionNameLowerCase]: option.optionType === products.OptionType.color ? description! : value! };

            // Filter out invalid options and check if the option combination is available for sale.
            const filtered = Object.entries(optionParams).filter(([key, value]) =>
              productOptions.find(
                (option) =>
                  option.name! === key &&
                  option.choices?.map(({ value }) => value).includes(value)
              )
            );

            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) =>
                  combination[key] === value && combination.availableForSale
              )
            );

            // The option is active if it's in the selected options.
            const isActive = selectedOptions[optionNameLowerCase] === (option.optionType === products.OptionType.color ? description : value);

            return (
              <>
                <input
                  type="radio"
                  aria-disabled={!isAvailableForSale}
                  disabled={!isAvailableForSale}
                  checked={isActive}
                  name={optionNameLowerCase}
                  value={value}
                  title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                  onChange={() => selectedVariantStore.setSelectedOptions(optionParams)}
                  className="hidden peer"
                />
                <label
                  onClick={() => { selectedVariantStore.setSelectedOptions(optionParams); console.log('optionParams', optionParams) }}
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
                  {description}
                </label>
              </>
            );
          })}
        </dd>
      </dl>
    ))
  );
}

function getVariants(product: products.Product) {
  return product.manageVariants
    ? product.variants?.map((variant) => ({
      id: variant._id!,
      title: product.name!,
      price: {
        amount: String(variant.variant?.priceData?.price),
        currencyCode: variant.variant?.priceData?.currency,
      },
      availableForSale: variant.stock?.trackQuantity
        ? ((variant.stock?.quantity ?? 0) > 0)
        : true,
      selectedOptions: Object.entries(variant.choices ?? {}).map(
        ([name, value]) => ({
          name,
          value,
        })
      ),
    }))
    : cartesian(
      product.productOptions?.map(
        (x) =>
          x.choices?.map((choice) => ({
            name: x.name,
            value:
              x.optionType === products.OptionType.color
                ? choice.description
                : choice.value,
          })) ?? []
      ) ?? []
    ).map((selectedOptions) => ({
      id: "00000000-0000-0000-0000-000000000000",
      title: product.name!,
      price: {
        amount: String(product.priceData?.price!),
        currencyCode: product.priceData?.currency!,
      },
      availableForSale: product.stock?.inventoryStatus === "IN_STOCK",
      selectedOptions: selectedOptions,
    }))
}

function cartesian<T>(data: T[][]) {
  return data.reduce((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [
    [],
  ] as T[][]);
}