export default async (load, opts, el) => {
  const hydrate = await load();
  await hydrate();
};
