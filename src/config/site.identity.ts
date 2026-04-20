export const siteIdentity = {
  code: process.env.NEXT_PUBLIC_SITE_CODE || 'thufpa2gp8',
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Hello Art City',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Image galleries & creator profiles',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Browse image-led posts and public profiles in one place—built for photographers, artists, and visual storytellers.',
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'helloartcity.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://helloartcity.com',
  ogImage: process.env.NEXT_PUBLIC_SITE_OG_IMAGE || '/og-default.png',
  googleMapsEmbedApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY || 'AIzaSyBco7dIECu3rJWjP3J0MImnR_uxlbeqAe0',

} as const

export const defaultAuthorProfile = {
  name: siteIdentity.name,
  avatar: '/placeholder.svg?height=80&width=80',
} as const
