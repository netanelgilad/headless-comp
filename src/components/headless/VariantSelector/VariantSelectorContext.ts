import { createContext } from "../Context";
import type { createSelectedVariantStore } from "../stores/SelectedVariantStore";

const [ Provider, getContext ] = createContext<{ storeId: string }>()

export const SelectedVariantStoreContext = Provider;
export const getSelectedVariantStoreId = () => getContext().storeId as string & ReturnType<typeof createSelectedVariantStore>;