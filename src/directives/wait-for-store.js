import { waitForStore } from "../components/headless/StoreManager";

export default async (load, { value: storeId }, el) => {
  await waitForStore(storeId);
  const hydrate = await load();
  await hydrate();
};
