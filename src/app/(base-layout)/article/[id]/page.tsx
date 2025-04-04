import { graphql } from '@/lib/datocms/graphql';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { StructuredText } from 'react-datocms';
export const dynamic = 'force-dynamic';

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
  authors: { name: string }[];
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
        }
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
    <div>
      <h1>{article.articleTitle}</h1>

      <h3>{article.headline}</h3>

      {article.picture && <img src={article.picture.url} alt={article.picture.alt || ''} />}

      <StructuredText data={article.body} />

      <p>Höfundur: {article.authors.map((a) => a.name).join(', ') || 'óþekktan höfund'}</p>
    </div>
  );
}
