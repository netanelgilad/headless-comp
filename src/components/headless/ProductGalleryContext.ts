import { createContext } from "./Context";
import type { createProductGalleryStore } from "./ProductGalleryStore";

const [ Provider, getContext ] = createContext<{ storeId: string }>()

export const ProductGalleryContext = Provider;
export const getProductGalleryStoreId = () => getContext().storeId as string & ReturnType<typeof createProductGalleryStore>;