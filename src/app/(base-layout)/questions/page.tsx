// import { executeQuery } from '@/lib/datocms/executeQuery';
// import { graphql } from '@/lib/datocms/graphql';
// import Link from 'next/link';
// import { notFound } from 'next/navigation';

// export const metadata = {
//   title: 'Spurningavefur Eyglóar',
// };

// const query = graphql(
//   /* GraphQL */ `
//   query Questions {
//     allQuestions {
//       questionTitle
//       id
//       authors {
//         name
//       }
//     }
//   }
//   `,
//   [],
// );

// export default async function QuestionsPage() {

//   const { allQuestions } = await executeQuery(query, {});
  
//     if (!allQuestions) {
//       notFound();
//     }
//   return (
//     <>
//       <h3>Hér eru spurningar: veldu eina og farðu að svara</h3>

//       <ul>
//         {allQuestions.map((question) => (
//           <li key={question.id}>
//             <Link href={`/questions/${question.id}`}>
//               {question.questionTitle}
//             </Link>
//             {' '}eftir {question.authors.length > 0 ? question.authors.map((author) => author.name).join(', ') : ''}
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }
// function localNotFound() {
//   throw new Error('Function not implemented.');
// }

