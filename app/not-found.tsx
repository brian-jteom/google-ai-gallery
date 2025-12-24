import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-black text-indigo-100 mb-8">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-8 text-lg">
          요청하신 페이지가 존재하지 않거나<br />
          이동되었을 수 있습니다.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
