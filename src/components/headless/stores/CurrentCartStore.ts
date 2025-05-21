import { currentCart } from "@wix/ecom";
import { atom, computed } from "nanostores";
import { registerStore } from "../StoreManager";

export function createCurrentCartStore(opts: {
    initialCart: currentCart.Cart & currentCart.CartNonNullableFields | undefined,
}) {
    const $cart = atom<currentCart.Cart & currentCart.CartNonNullableFields | undefined>(opts.initialCart);
    const $isOpen = atom(false);

    return {
        $cart,
        $isOpen,
        $cartCount: computed($cart, (cart) => {
            return cart?.lineItems!.reduce((acc, item) => {
                return acc + item.quantity!;
            }, 0) ?? 0;
        }),
        addToCart: async (...params: Parameters<typeof currentCart.addToCurrentCart>) => {
            const { cart } = await currentCart.addToCurrentCart(...params);
            $cart.set(cart!);
        },
        open: () => {
            $isOpen.set(true);
        },
        close: () => {
            $isOpen.set(false);
        },
        removeLineItem: async (lineItemId: string) => {
            const { cart } = await currentCart.removeLineItemsFromCurrentCart([lineItemId]);
            $cart.set(cart!);
        },
        updateLineItemQuantity: async (lineItemId: string, quantity: number) => {
            const { cart } = await currentCart.updateCurrentCartLineItemQuantity([{
                _id: lineItemId,
                quantity,
            }]);
            $cart.set(cart!);
        },
        increaseLineItemQuantity: async (lineItemId: string) => {
            const currentQuantity = $cart.get()?.lineItems?.find(item => item._id === lineItemId)?.quantity ?? 0;
            const { cart } = await currentCart.updateCurrentCartLineItemQuantity([{
                _id: lineItemId,
                quantity: currentQuantity + 1,
            }]);
            $cart.set(cart!);
        },
        decreaseLineItemQuantity: async (lineItemId: string) => {
            const currentQuantity = $cart.get()?.lineItems?.find(item => item._id === lineItemId)?.quantity ?? 0;
            const { cart } = await currentCart.updateCurrentCartLineItemQuantity([{
                _id: lineItemId,
                quantity: currentQuantity - 1,
            }]);
            $cart.set(cart!);
        },
    }
}

registerStore("currentCart", createCurrentCartStore);