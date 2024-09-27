import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl text-black font-bold mb-4">Welcome to Your Company Website</h1>
        <p className="mb-4 text-black">This is the protected content of your website.</p>
        <Link href="/folders" className="text-blue-500 hover:underline">
          Go to Folders
        </Link>
      </div>
    </div>
  )
}