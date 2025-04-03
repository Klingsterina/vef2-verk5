import Link from 'next/link';

export const metadata = {
  title: 'Spurningavefur Eyglóar',
};

export default function QuestionsPage() {
  return (
    <>
      <h3>Hér eru spurningar: veldu eina og farðu að svara</h3>

      <ul>
        <li>
          <Link href="/basic">Basic:</Link> <span>Simpler code, great to start exploring</span>
        </li>
        <li>
          <Link href="/real-time-updates">Real-time Updates:</Link>{' '}
        </li>
      </ul>
    </>
  );
}
