import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StructuredText } from 'react-datocms';
export const dynamic = 'force-dynamic';
import styles from '../../../../Styles/page.module.scss';
import Avatar from '@/components/avatar/Avatar';

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
        headline
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
          picture {
            url
          }
        }
        _createdAt
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
  headline: string;
  body: { value: any };
  picture: {
    url: string;
    alt: string;
    title: string;
  } | null;
  authors: {
    picture: { url: string; }; name: string
  }[];
  _createdAt: string;
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
          <li key={q.id} className={styles.article}>
            <h2 style={{fontSize: '3rem'}}>{q.articleTitle}</h2>
            <div className={styles.articleContent}>
              {q.picture && (
                <Link href={`/article/${q.id}`}>
                  <img className={styles.articleImage}
                    src={q.picture.url}
                    alt={q.picture.alt || ''}
                  />
                </Link>
              )}
              <div className={styles.articleText}>
                <p>{q.headline}</p>
                <p>
                  {new Date(q._createdAt).toLocaleDateString('is-IS', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>Höfund{q.authors.length > 1 ? 'ar' : 'ur'}:</p>
            <div className={styles.authorContainer}>
              {q.authors && q.authors.length > 0 ? (
                q.authors.map((author, i) => (
                  <div className={styles.author}>
                    <Avatar name={author.name} picture={author.picture} />
                    <p>{author.name}</p>
                  </div>
                ))
              ) : (
                <p>Höfundur: óþekktur</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
