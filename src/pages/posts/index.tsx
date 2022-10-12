import * as Prismic from '@prismicio/client'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { RichText } from 'prismic-dom'
import { Header } from '../../components/Header'
import { getPrismicClient } from '../../services/prismic'
import styles from './styles.module.scss'

type Posts = {
  slug: string,
  title: string,
  excerpt: string,
  updatedAt: string,
}

interface PostProps {
  posts: Posts[]
}

export default function Posts({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>
          Posts | igNews
        </title>
      </Head>
      <Header />
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`}>
              <a key={post.slug}>
                <time>
                  {post.updatedAt}
                </time>
                <strong>
                  {post.title}
                </strong>
                <p>
                  {post.excerpt}
                </p>
              </a>
            </Link>
          )
          )}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicate.at('document.type', 'publication')
  ], {
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100,
  }
  )

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  console.log(response)

  return {
    props: {
      posts
    }
  }
}
