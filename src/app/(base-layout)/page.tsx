import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import Link from 'next/link';
import styles from '../../Styles/page.module.scss';
import Avatar from '@/components/avatar/Avatar';

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

type Article = {
  id: string;
  articleTitle: string;
  headline: string;
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

export default async function HomePage() {
  const { allArticles } = (await executeQuery(allArticlesQuery)) as {
    allArticles: Article[];
  };

  return (
    <main>
      <h1 className={styles.h1}>Nýjustu fréttir</h1>
      <ul>
        {allArticles.map((article) => (
          <li key={article.id} className={styles.article}>
            <h2 style={{fontSize: '3rem'}}>
              <Link href={`/article/${article.id}`}>{article.articleTitle}</Link>
            </h2>
            <div className={styles.articleContent}>
              {article.picture && (
                <Link href={`/article/${article.id}`}>
                <img className={styles.articleImage}
                  src={article.picture.url}
                  alt={article.picture.alt || ''}
                />
              </Link>
              )}
              <div className={styles.articleText}>
                <p>{article.headline}</p>
                <p>
                  {new Date(article._createdAt).toLocaleDateString('is-IS', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>Höfund{article.authors.length > 1 ? 'ar' : 'ur'}:</p>
            <div className={styles.authorContainer}>
              {article.authors && article.authors.length > 0 ? (
                article.authors.map((author, i) => (
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
    </main>
  );
}
