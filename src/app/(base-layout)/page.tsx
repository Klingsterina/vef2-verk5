import { executeQuery } from '@/lib/datocms/executeQuery';
import { generateMetadataFn } from '@/lib/datocms/generateMetadataFn';
import { graphql } from '@/lib/datocms/graphql';
import { draftMode } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const query = graphql(
  `query Categories {
    allQuestioncategories {
      title
      slug
    }
  }`,
  []
);

type QuestionCategory = {
  title: string;
  slug: string;
};

type QueryResult = {
  allQuestioncategories: QuestionCategory[];
};

export const generateMetadata = generateMetadataFn({
  query,
  pickSeoMetaTags: () => [],
});

export default async function Page() {
  const { isEnabled: isDraftModeEnabled } = draftMode();

  const { allQuestioncategories } = (await executeQuery(query, {
    includeDrafts: isDraftModeEnabled,
  })) as QueryResult;

  if (!allQuestioncategories || allQuestioncategories.length === 0) {
    notFound();
  }

  return (
    <>
      <h1>Flokkar</h1>
      <ul>
        {allQuestioncategories.map((category) => (
          <li key={category.slug}>
            <Link href={`/category/${category.slug}`}>{category.title}</Link>
          </li>
        ))}
      </ul>
      <footer></footer>
    </>
  );
}
