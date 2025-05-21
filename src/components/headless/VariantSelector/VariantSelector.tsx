import { products } from "@wix/stores";
import type { createSelectedVariantStore, SelectedVariantStoreInput } from "../stores/SelectedVariantStore";
import { useStore } from "@nanostores/react";
import { getStore } from "../StoreManager";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function ProductOptionChoice(props: {
  option: products.ProductOption,
  choice: products.Choice,
  selectedVariantStoreId: string & ReturnType<typeof createSelectedVariantStore>,
  children: (params: {
    isActive: boolean,
    isAvailableForSale: boolean,
    optionName: string,
    choiceValue: string,
    optionParams: Record<string, string>,
    handleSelect: () => void
  }) => React.ReactNode
}) {
  const { $selectedOptions, input, setSelectedOptions } = getStore(props.selectedVariantStoreId);
  const selectedOptions = useStore($selectedOptions);

  const combinations: Combination[] = getVariants(input)?.map((variant) => ({
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

  const optionNameLowerCase = props.option.name!;
  const choiceValue = props.option.optionType === products.OptionType.color ? props.choice.description! : props.choice.value!;

  const optionParams = {
    ...selectedOptions,
    [optionNameLowerCase]: choiceValue
  };

  const filtered = Object.entries(optionParams).filter(([key, value]) =>
    input.productOptions?.find(
      (option) =>
        option.name! === key &&
        option.choices?.map(({ value, description }) => option.optionType === products.OptionType.color ? description : value).includes(value)
    )
  );

  const isAvailableForSale = !!combinations.find((combination) =>
    filtered.every(
      ([key, value]) =>
        combination[key] === value && combination.availableForSale
    )
  );

  const isActive = selectedOptions[optionNameLowerCase] === choiceValue;
  const handleSelect = () => setSelectedOptions(optionParams);

  return props.children({
    isActive,
    isAvailableForSale,
    optionName: optionNameLowerCase,
    choiceValue: props.choice.value!,
    optionParams,
    handleSelect
  });
}

export function getVariants(product: SelectedVariantStoreInput) {
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

export function AddSelectedVariantToCart(props: {
  selectedVariantStoreId: string & ReturnType<typeof createSelectedVariantStore>,
  children: (params: {
    addSelectedVariantToCart: () => void
    isAvailableForSale: boolean
  }) => React.ReactNode
}) {
  const {  addSelectedVariantToCart, $isAvailableForSale } = getStore(props.selectedVariantStoreId);
  const isAvailableForSale = useStore($isAvailableForSale);

  return props.children({
    addSelectedVariantToCart,
    isAvailableForSale: isAvailableForSale ?? false
  })
}
