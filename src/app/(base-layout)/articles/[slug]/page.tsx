import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StructuredText } from 'react-datocms';
export const dynamic = 'force-dynamic';
import styles from '../../../../Styles/page.module.scss';

const categoryQuery = graphql(
  `
    query GetCategoryBySlug($slug: String) {
      articlecategory(filter: { slug: { eq: $slug } }) {
        id
        title
      }
    }
  `,
  [],
);

const articlesQuery = graphql(
  `
    query GetArticlesByCategoryId($id: ItemId) {
      allArticles(filter: { flokkur: { eq: $id } }) {
        id
        articleTitle
        body {
          value
        }
        picture {
          url
          alt
          title
        }
        authors {
          name
        }
      }
    }
  `,
  [],
);

type Props = {
  params: {
    slug: string;
  };
};

type Article = {
  id: string;
  articleTitle: string;
  body: { value: any };
  picture: {
    url: string;
    alt: string;
    title: string;
  } | null;
  authors: { name: string }[];
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = params;

  const { articlecategory } = (await executeQuery(categoryQuery, {
    variables: { slug },
  })) as {
    articlecategory: { id: string; title: string } | null;
  };

  if (!articlecategory) {
    notFound();
  }

  const { allArticles } = (await executeQuery(articlesQuery, {
    variables: { id: articlecategory.id },
  })) as {
    allArticles: Article[];
  };

  console.log(allArticles);

  return (
    <>
      <h1 className={styles.h1}>Fréttir í flokki: {articlecategory.title}</h1>
      <ul>
        {allArticles.map((q) => (
          <li key={q.id}>
            {q.picture && (
              <img
                src={q.picture.url}
                alt={q.picture.alt || ''}
                style={{ maxWidth: '300px', marginTop: '10px' }}
              />
            )}
            <Link href={`/article/${q.id}`}>{q.articleTitle}</Link> eftir{' '}
            {q.authors.map((a) => a.name).join(', ') || 'óþekktan höfund'}
            <StructuredText data={q.body} />
          </li>
        ))}
      </ul>
    </>
  );
}
