import { media } from "@wix/sdk";
import clsx from "clsx";
import { createUrl } from "../../lib/utils";
import {
  CurrentCartEmptyState as CurrentCartEmptyStatePrimitive,
  CurrentCartIcon as CurrentCartIconPrimitive,
  CurrentCartLineItems as CurrentCartLineItemsPrimitive,
  CurrentCartModalClose as CurrentCartModalClosePrimitive,
  CurrentCartModal as CurrentCartModalPrimitive,
  CurrentCartRemoveLineItemTrigger as CurrentCartRemoveLineItemTriggerPrimitive,
  CurrentCartModalContent as CurrentCartModalContentPrimitive,
  CurrentCartIncreaseItemQuantityTrigger as CurrentCartIncreaseItemQuantityTriggerPrimitive,
  CurrentCartDecreaseItemQuantityTrigger as CurrentCartDecreaseItemQuantityTriggerPrimitive,
  CurrentCartLineItemPrice as CurrentCartLineItemPricePrimitive,
  CurrentCartTaxes as CurrentCartTaxesPrimitive,
  CurrentCartTotal as CurrentCartTotalPrimitive,
} from "../headless/CurrentCart/CurrentCart";
import ShoppingCartIcon from "./ShoppingCartIcon";
import XMarkIcon from "./XMarkIcon";
import PlusIcon from "./PlusIcon";
import MinusIcon from "./MinusIcon";
import { Price } from "./Price";

export const CurrentCartIcon = (
  props: Omit<React.ComponentProps<typeof CurrentCartIconPrimitive>, "children">
) => (
  <CurrentCartIconPrimitive {...props}>
    {({ cartCount, open }) => (
      <button aria-label="Open cart" onClick={open}>
        <span className="sr-only">Open cart</span>
        <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
          <ShoppingCartIcon className="h-4 transition-all ease-in-out hover:scale-110" />

          {cartCount ? (
            <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white">
              {cartCount}
            </div>
          ) : null}
        </div>
      </button>
    )}
  </CurrentCartIconPrimitive>
);

export const CurrentCartModal = (
  props: Omit<
    React.ComponentProps<typeof CurrentCartModalPrimitive>,
    "children"
  > & { children?: React.ReactNode }
) => (
  <CurrentCartModalPrimitive {...props}>
    {({ isOpen, close }) => (
      <div className="relative z-50">
        <label
          onClick={close}
          className={clsx(
            "fixed inset-0 bg-black/30 transition-all ease-in-out duration-300",
            {
              "opacity-100 backdrop-blur-[.5px] block": isOpen,
              "opacity-0 backdrop-blur-none hidden": !isOpen,
            }
          )}
          aria-hidden="true"
        ></label>
        <div
          className={clsx(
            "fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white transition-all ease-in-out duration-300",
            {
              "translate-x-0": isOpen,
              "translate-x-full": !isOpen,
            }
          )}
        >
          {props.children}
        </div>
      </div>
    )}
  </CurrentCartModalPrimitive>
);

export const CurrentCartModalClose = (
  props: Omit<
    React.ComponentProps<typeof CurrentCartModalClosePrimitive>,
    "children"
  > & { children?: React.ReactNode }
) => (
  <CurrentCartModalClosePrimitive {...props}>
    {({ close }) => (
      <button aria-label="Close cart" onClick={close}>
        <span className="sr-only">Close cart</span>
        <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
          <XMarkIcon
            className={clsx("h-6 transition-all ease-in-out hover:scale-110")}
          />
        </div>
      </button>
    )}
  </CurrentCartModalClosePrimitive>
);

export const CurrentCartRemoveLineItemButton = (
  props: Omit<
    React.ComponentProps<typeof CurrentCartRemoveLineItemTriggerPrimitive>,
    "children"
  > & { children?: React.ReactNode }
) => (
  <CurrentCartRemoveLineItemTriggerPrimitive {...props}>
    {({ removeLineItem }) => (
      <button
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
        onClick={removeLineItem}
      >
        <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
    )}
  </CurrentCartRemoveLineItemTriggerPrimitive>
);

export const CurrentCartEmptyState = (
  props: Omit<
    React.ComponentProps<typeof CurrentCartEmptyStatePrimitive>,
    "children"
  >
) => (
  <CurrentCartEmptyStatePrimitive {...props}>
    <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
      <ShoppingCartIcon className="h-16" />
      <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
    </div>
  </CurrentCartEmptyStatePrimitive>
);

export const CurrentCartModalContent = (
  props: Omit<
    React.ComponentProps<typeof CurrentCartModalContentPrimitive>,
    "children"
  > & { children?: React.ReactNode }
) => (
  <CurrentCartModalContentPrimitive {...props}>
    <div className="flex h-full flex-col justify-between overflow-hidden p-1">
      {props.children}
    </div>
  </CurrentCartModalContentPrimitive>
);

export const CurrentCartLineItems = (
  props: Omit<
    React.ComponentProps<typeof CurrentCartLineItemsPrimitive>,
    "children"
  > & { children?: React.ReactNode }
) => (
  <CurrentCartLineItemsPrimitive {...props}>
    {({ lineItems }) => (
      <ul className="flex-grow overflow-auto py-4">
        {lineItems
          .sort((a, b) =>
            (a.productName?.original ?? "").localeCompare(
              b.productName?.original ?? ""
            )
          )
          .map((item) => {
            const merchandiseUrl = createUrl(
              `/product/${item.url?.split("/").pop() ?? ""}`,
              new URLSearchParams()
            );

            return (
              <li
                className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                key={item._id}
              >
                <div className="relative flex w-full flex-row justify-between px-1 py-4">
                  <div className="absolute z-40 -ml-1 -mt-2">
                    <CurrentCartRemoveLineItemButton
                      currentCartStoreId={props.currentCartStoreId}
                      lineItemId={item._id!}
                    />
                  </div>
                  <div className="flex flex-row">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                      <img
                        className="h-full w-full object-cover"
                        width={64}
                        height={64}
                        loading="lazy"
                        alt={item.productName?.original}
                        src={media.getImageUrl(item.image!).url}
                      />
                    </div>
                    <a
                      href={merchandiseUrl}
                      className="z-30 ml-2 flex flex-row space-x-4"
                    >
                      <div className="flex flex-1 flex-col text-base">
                        <span className="leading-tight">
                          {item.productName?.original}
                        </span>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {item.descriptionLines?.[0]?.plainText?.original}
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="flex h-16 flex-col justify-between">
                    <CurrentCartLineItemPrice
                      currentCartStoreId={props.currentCartStoreId}
                      lineItemId={item._id!}
                    />
                    <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                      <CurrentCartDecreaseItemQuantityButton
                        currentCartStoreId={props.currentCartStoreId}
                        lineItemId={item._id!}
                      />
                      <p className="w-6 text-center">
                        <span className="w-full text-sm">{item.quantity}</span>
                      </p>
                      <CurrentCartIncreaseItemQuantityButton
                        currentCartStoreId={props.currentCartStoreId}
                        lineItemId={item._id!}
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    )}
  </CurrentCartLineItemsPrimitive>
);

export const CurrentCartIncreaseItemQuantityButton = (
  props: Omit<
    React.ComponentProps<
      typeof CurrentCartIncreaseItemQuantityTriggerPrimitive
    >,
    "children"
  > & { children?: React.ReactNode }
) => (
  <CurrentCartIncreaseItemQuantityTriggerPrimitive {...props}>
    {({ increaseItemQuantity }) => (
      <button
        aria-label="Increase item quantity"
        className="ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80"
        onClick={increaseItemQuantity}
      >
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      </button>
    )}
  </CurrentCartIncreaseItemQuantityTriggerPrimitive>
);

export const CurrentCartDecreaseItemQuantityButton = (
  props: Omit<
    React.ComponentProps<
      typeof CurrentCartDecreaseItemQuantityTriggerPrimitive
    >,
    "children"
  > & { children?: React.ReactNode }
) => (
  <CurrentCartDecreaseItemQuantityTriggerPrimitive {...props}>
    {({ decreaseItemQuantity }) => (
      <button
        aria-label="Decrease item quantity"
        className="ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80"
        onClick={decreaseItemQuantity}
      >
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      </button>
    )}
  </CurrentCartDecreaseItemQuantityTriggerPrimitive>
);

export const CurrentCartLineItemPrice = (
  props: Omit<
    React.ComponentProps<typeof CurrentCartLineItemPricePrimitive>,
    "children"
  > & { children?: React.ReactNode }
) => (
  <CurrentCartLineItemPricePrimitive {...props}>
    {({ amount, currencyCode }) => (
      <Price
        className="flex justify-end space-y-2 text-right text-sm"
        amount={amount}
        currencyCode={currencyCode}
      />
    )}
  </CurrentCartLineItemPricePrimitive>
);

export const CurrentCartTaxes = (
  props: Omit<
    React.ComponentProps<typeof CurrentCartTaxesPrimitive>,
    "children"
  > & { children?: React.ReactNode }
) => (
  <CurrentCartTaxesPrimitive {...props}>
    {({ amount, currencyCode }) => (
      <Price
        className="flex justify-end space-y-2 text-right text-sm"
        amount={amount}
        currencyCode={currencyCode}
      />
    )}
  </CurrentCartTaxesPrimitive>
);

export const CurrentCartTotal = (
  props: Omit<
    React.ComponentProps<typeof CurrentCartTotalPrimitive>,
    "children"
  > & { children?: React.ReactNode }
) => (
  <CurrentCartTotalPrimitive {...props}>
    {({ amount, currencyCode }) => (
      <Price
        className="text-right text-base text-black dark:text-white"
        amount={amount}
        currencyCode={currencyCode}
      />
    )}
  </CurrentCartTotalPrimitive>
);