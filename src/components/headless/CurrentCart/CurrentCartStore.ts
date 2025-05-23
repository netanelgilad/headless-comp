
import { currentCart } from "@wix/ecom";
import { atom, computed } from "nanostores";

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
    }
}