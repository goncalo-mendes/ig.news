import * as Prismic from '@prismicio/client'

export function getPrismicClient() {
  const prismic = Prismic.createClient(
    process.env.PRISMIC_REPOSITORY_API,
    {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    }
  )

  return prismic
}
