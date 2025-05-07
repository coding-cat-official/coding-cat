// capitalizes the first letter of each word in a string
export function capitalizeString(string: string): string {
  const str = string.replaceAll("_", " ");
  const capitalizedString = str
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

  return capitalizedString;
}
