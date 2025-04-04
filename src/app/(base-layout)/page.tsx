import { executeQuery } from '@/lib/datocms/executeQuery';
import { generateMetadataFn } from '@/lib/datocms/generateMetadataFn';
import { graphql } from '@/lib/datocms/graphql';
import { draftMode } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const query = graphql(
  `
    query GetCategories {
      allArticlecategories {
        title
        slug
      }
    }
  `,
  [],
);

type ArticleCategory = {
  title: string;
  slug: string;
};

type QueryResult = {
  allArticlecategories: ArticleCategory[];
};

export const generateMetadata = generateMetadataFn({
  query,
  pickSeoMetaTags: () => [],
});

export default async function Page() {
  const { isEnabled: isDraftModeEnabled } = draftMode();

  const { allArticlecategories } = (await executeQuery(query, {
    includeDrafts: isDraftModeEnabled,
  })) as QueryResult;

  if (!allArticlecategories || allArticlecategories.length === 0) {
    notFound();
  }

  console.log('allArticlecategories', allArticlecategories);

  return (
    <>
      <h1>Flokkar</h1>
      <ul>
        {allArticlecategories.map((category) => (
          <li key={category.slug}>
            <Link href={`/category/${category.slug}`}>{category.title}</Link>
          </li>
        ))}
      </ul>
      <footer></footer>
    </>
  );
}
