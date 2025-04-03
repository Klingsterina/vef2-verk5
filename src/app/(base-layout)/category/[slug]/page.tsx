import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StructuredText } from 'react-datocms';

const categoryQuery = graphql(
  `
    query GetCategoryBySlug($slug: String) {
      questioncategory(filter: { slug: { eq: $slug } }) {
        id
        title
      }
    }
  `,
  [],
);

const questionsQuery = graphql(
  `
    query GetQuestionsByCategoryId($id: ItemId) {
      allQuestions(filter: { flokkur: { eq: $id } }) {
        id
        questionTitle
        body {
          value
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

type Question = {
  id: string;
  questionTitle: string;
  body: {value: any};
  authors: { name: string }[];
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = params;

  const { questioncategory } = (await executeQuery(categoryQuery, {
    variables: { slug },
  })) as {
    questioncategory: { id: string; title: string } | null;
  };

  if (!questioncategory) {
    notFound();
  }

  const { allQuestions } = (await executeQuery(questionsQuery, {
    variables: { id: questioncategory.id },
  })) as {
    allQuestions: Question[];
  };

  return (
    <>
      <h1>Fréttir í flokki: {questioncategory.title}</h1>
      <ul>
        {allQuestions.map((q) => (
          <li key={q.id}>
            <Link href={`/questions/${q.id}`}>{q.questionTitle}</Link> eftir{' '}
            {q.authors.map((a) => a.name).join(', ') || 'óþekktan höfund'}
            <div>
              <StructuredText data={q.body}/>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
