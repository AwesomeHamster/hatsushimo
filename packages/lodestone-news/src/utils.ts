import { URL } from 'url'

export function fixUrl(url: string, rootUrl: string) {
  if (url.startsWith('http')) {
    return url
  }
  const root = new URL(rootUrl)
  if (url.startsWith('/')) {
    return `${root.origin}${url}`
  } else {
    root.pathname += `/${url}`
    return root.toString()
  }
}
