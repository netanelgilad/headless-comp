import { useStore } from "@nanostores/react";
import { getStore } from "../StoreManager";
import { createCurrentCartStore } from "./CurrentCartStore";
import type { currentCart } from "@wix/ecom";

export function CurrentCartIcon(props: {
  currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>;
  children: (params: {
    cartCount: number;
    open: () => void;
  }) => React.ReactNode;
}) {
  const currentCartStore = getStore(props.currentCartStoreId);
  const cartCount = useStore(currentCartStore.$cartCount);

  return props.children({
    cartCount,
    open: currentCartStore.open,
  });
}

export function CurrentCartModal(props: {
  currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>;
  children: (params: { isOpen: boolean; close: () => void }) => React.ReactNode;
}) {
  const currentCartStore = getStore(props.currentCartStoreId);
  const isOpen = useStore(currentCartStore.$isOpen);

  return props.children({
    isOpen,
    close: currentCartStore.close,
  });
}

export function CurrentCartModalClose(props: {
  currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>;
  children: (params: { close: () => void }) => React.ReactNode;
}) {
  const currentCartStore = getStore(props.currentCartStoreId);

  return props.children({
    close: currentCartStore.close,
  });
}

export function CurrentCartLineItems(props: {
  currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>;
  children: (params: { lineItems: currentCart.LineItem[] }) => React.ReactNode;
}) {
  const { $cart } = getStore(props.currentCartStoreId);
  const lineItems = useStore($cart)?.lineItems ?? [];

  return props.children({
    lineItems,
  });
}

export function CurrentCartEmptyState(props: {
  currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>;
  children: React.ReactNode;
}) {
  const { $cart } = getStore(props.currentCartStoreId);
  const lineItems = useStore($cart)?.lineItems ?? [];

  if (lineItems.length === 0) {
    return props.children;
  }

  return null;
}

export function CurrentCartRemoveLineItemTrigger(props: {
  currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>;
  lineItemId: string;
  children: (params: {
    removeLineItem: () => Promise<void>;
  }) => React.ReactNode;
}) {
  const currentCartStore = getStore(props.currentCartStoreId);

  return props.children({
    removeLineItem: () => currentCartStore.removeLineItem(props.lineItemId),
  });
}

export function CurrentCartModalContent(props: {
  currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>;
  children: React.ReactNode;
}) {
  const { $cart } = getStore(props.currentCartStoreId);
  const lineItems = useStore($cart)?.lineItems ?? [];

  if (lineItems.length === 0) {
    return null;
  }

  return props.children;
}

export function CurrentCartIncreaseItemQuantityTrigger(props: {
  currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>;
  lineItemId: string;
  children: (params: {
    increaseItemQuantity: () => Promise<void>;
  }) => React.ReactNode;
}) {
  const { increaseLineItemQuantity } = getStore(props.currentCartStoreId);

  return props.children({
    increaseItemQuantity: () =>
      increaseLineItemQuantity(props.lineItemId),
  });
}

export function CurrentCartDecreaseItemQuantityTrigger(props: {
  currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>;
  lineItemId: string;
  children: (params: {
    decreaseItemQuantity: () => Promise<void>;
  }) => React.ReactNode;
}) {
  const { decreaseLineItemQuantity } = getStore(props.currentCartStoreId);

  return props.children({
    decreaseItemQuantity: () =>
      decreaseLineItemQuantity(props.lineItemId),
  });
}

export function CurrentCartLineItemPrice(props: {
  currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>;
  lineItemId: string;
  children: (params: {
    amount: string;
    currencyCode: string;
  }) => React.ReactNode;
}) {
  const { $cart } = getStore(props.currentCartStoreId);
  const cart = useStore($cart);
  const lineItem = cart?.lineItems?.find(item => item._id === props.lineItemId);

  const amount = String(
    Number.parseFloat(lineItem?.price?.amount!) * lineItem?.quantity!
  );

  const currencyCode = cart?.currency!;

  return props.children({
    amount,
    currencyCode,
  });
}

export function CurrentCartTaxes(props: {
  currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>;
  children: (params: {
    amount: string;
    currencyCode: string;
  }) => React.ReactNode;
}) {
  const { $cart } = getStore(props.currentCartStoreId);
  const cart = useStore($cart);

  const amount = "0";
  const currencyCode = cart?.currency ?? "USD";

  return props.children({
    amount,
    currencyCode,
  });
}

export function CurrentCartTotal(props: {
  currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>;
  children: (params: {
    amount: string;
    currencyCode: string;
  }) => React.ReactNode;
}) {
  const { $cart } = getStore(props.currentCartStoreId);
  const cart = useStore($cart);

  const amount = String(
    cart?.lineItems?.reduce((acc, item) => {
      return acc + Number.parseFloat(item.price?.amount!) * item.quantity!;
    }, 0) ?? "0"
  );
  const currencyCode = cart?.currency ?? "USD";

  return props.children({
    amount,
    currencyCode,
  });
}