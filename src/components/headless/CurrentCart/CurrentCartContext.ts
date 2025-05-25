import { createContext } from "../Context";
import type { createCurrentCartStore } from "../stores/CurrentCartStore";

const [ Provider, getContext ] = createContext<{ storeId: string }>()

export const CurrentCartContext = Provider;
export const getCurrentCartStoreId = () => getContext().storeId as string & ReturnType<typeof createCurrentCartStore>;