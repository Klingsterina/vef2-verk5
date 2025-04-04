import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

const allArticlesQuery = graphql(
  `
    query GetLatestArticles {
      allArticles(first: 3, orderBy: _createdAt_DESC) {
        id
        articleTitle
        headline
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

type Article = {
  id: string;
  articleTitle: string;
  headline: string;
  picture: {
    url: string;
    alt: string;
    title: string;
  } | null;
  authors: { name: string }[];
};

export default async function HomePage() {
  const { allArticles } = (await executeQuery(allArticlesQuery)) as {
    allArticles: Article[];
  };

  return (
    <main>
      <h1>Nýjustu fréttir</h1>
      <ul>
        {allArticles.map((article) => (
          <li key={article.id}>
            <h2>
              <Link href={`/article/${article.id}`}>{article.articleTitle}</Link>
            </h2>
            <p>{article.headline}</p>
            {article.picture && (
              <Link href={`/article/${article.id}`}>
                <img
                  src={article.picture.url}
                  alt={article.picture.alt || ''}
                  style={{ maxWidth: '300px' }}
                />
              </Link>
            )}
            <p>Höfundur: {article.authors.map((a) => a.name).join(', ') || 'óþekktur'}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
