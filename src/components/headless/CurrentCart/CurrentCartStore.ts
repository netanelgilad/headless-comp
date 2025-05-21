
import { currentCart } from "@wix/ecom";
import { atom } from "nanostores";

export function createCurrentCartStore(opts: {
    initialCart: currentCart.Cart & currentCart.CartNonNullableFields | undefined,
}) {
    const $cart = atom<currentCart.Cart & currentCart.CartNonNullableFields | undefined>(opts.initialCart);

    return {
        $cart,
        addToCart: async (...params: Parameters<typeof currentCart.addToCurrentCart>) => {
            const { cart } = await currentCart.addToCurrentCart(...params);

            $cart.set(cart!);
        },
    }
}