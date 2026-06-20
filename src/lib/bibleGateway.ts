export function bibleGatewayUrl(passage: string, version = 'NIV'): string {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(
    passage,
  )}&version=${version}`;
}
