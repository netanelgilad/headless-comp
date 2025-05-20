export default async (load, opts, el) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
  const hydrate = await load();
  await hydrate();
};
