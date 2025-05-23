import { useStore } from "@nanostores/react";
import { getStore } from "../StoreManager";
import { createCurrentCartStore } from "./CurrentCartStore";

export function CurrentCartIcon(props: {
    currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>,
    children: (params: {
        cartCount: number;
        open: () => void;
    }) => React.ReactNode
}) {
    const currentCartStore = getStore(props.currentCartStoreId);
    const cartCount = useStore(currentCartStore.$cartCount);

    return props.children({
        cartCount,
        open: currentCartStore.open,
    });
}

export function CurrentCartModal(props: {
    currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>,
    children: (params: {
        isOpen: boolean;
        close: () => void;
    }) => React.ReactNode
}) {
    const currentCartStore = getStore(props.currentCartStoreId);
    const isOpen = useStore(currentCartStore.$isOpen);

    return props.children({
        isOpen,
        close: currentCartStore.close,
    });
}

export function CurrentCartModalClose(props: {
    currentCartStoreId: string & ReturnType<typeof createCurrentCartStore>,
    children: (params: {
        close: () => void;
    }) => React.ReactNode
}) {
    const currentCartStore = getStore(props.currentCartStoreId);

    return props.children({
        close: currentCartStore.close,
    });
}