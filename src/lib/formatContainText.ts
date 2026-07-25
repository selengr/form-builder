export function formatContainText(input: string): string {
  return input
    .trim()
    .split(/\s+/)
    .map((word) => `"${word}"`)
    .join(',');
}
