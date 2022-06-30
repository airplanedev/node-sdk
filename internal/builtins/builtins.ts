export const convertResourceAliasToID = (alias: string) => {
  const resources = JSON.parse(process.env.AIRPLANE_RESOURCES ?? "{}");
  const resource_version = process.env.AIRPLANE_RESOURCES_VERSION ?? null;

  if (!resource_version || resource_version !== "2") {
    throw new Error("resources version unsupported");
  }

  if (!(alias in resources)) {
    throw new Error(`resource alias ${alias} is unknown (have you attached the resource?)`);
  }

  if (!("id" in resources[alias])) {
    throw new Error("unexpected resources env var format");
  }

  return resources[alias].id;
};
