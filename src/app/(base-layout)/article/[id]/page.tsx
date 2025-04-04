import { graphql } from '@/lib/datocms/graphql';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { StructuredText } from 'react-datocms';
export const dynamic = 'force-dynamic';
import styles from '../../../../Styles/page.module.scss';
import Avatar from '@/components/avatar/Avatar';

type Props = {
  params: {
    id: string;
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
    name: string;
    picture: { url: string };
  }[];
  _createdAt: string;
};

const articleQuery = graphql(
  `
    query GetArticleById($id: ItemId) {
      article(filter: { id: { eq: $id } }) {
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

export default async function Article({ params }: Props) {
  const { id } = params;

  const { article } = (await executeQuery(articleQuery, {
    variables: { id },
  })) as { article: Article | null };

  if (!article) {
    return <p>Spurning fannst ekki!</p>;
  }

  return (
    <div className={styles.article}>
      <div className={styles.articleContent}>
        <h1 style={{ fontSize: '3rem' }}>{article.articleTitle}</h1>

        <h3>{article.headline}</h3>

        {article.picture && (
          <img
            className={styles.articleImage}
            src={article.picture.url}
            alt={article.picture.alt || ''}
          />
        )}

        <StructuredText data={article.body} />

        <div className={styles.articleText}>
          <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Published:</p>
          <p>
            {new Date(article._createdAt).toLocaleDateString('is-IS', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Höfund{article.authors.length > 1 ? 'ar' : 'ur'}:
      </p>
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
    </div>
  );
}
