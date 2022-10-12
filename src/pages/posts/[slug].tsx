import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Header } from "../../components/Header";
import { getPrismicClient } from "../../services/prismic";
import * as Prismic from '@prismicio/client'
import { RichText } from "prismic-dom";
import Head from "next/head";
import styles from './post.module.scss'

interface PostProsps {
  post: {
    slug: string,
    title: string,
    content: string,
    updatedAt: string
  }
}

export default function Post({ post }: PostProsps) {
  return (
    <>
      <Head>
        <title>{post.title} | igNews</title>
      </Head>
      <Header />
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req })
  const { slug } = params;

  console.log(session)

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient()
  const response = await prismic.getByUID('publication', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post
    }
  }
}
