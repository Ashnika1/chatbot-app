'use client';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex flex-col items-center justify-center text-white font-sans px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
          🤖 Welcome to NeoBot
        </h1>

        <p className="text-lg text-gray-300 mb-10">
          Your smart AI companion. Upload PDFs, ask questions, and get answers instantly — all powered by GPT and Node.js.
        </p>

        <div className="flex gap-6 justify-center">
          <button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition px-6 py-3 rounded-xl text-white font-semibold shadow-lg"
          >
            🔐 Login
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition px-6 py-3 rounded-xl text-white font-semibold shadow-lg"
          >
            📝 Signup
          </button>
        </div>
      </div>

      <footer className="absolute bottom-4 text-sm text-purple-300 opacity-70">
        Built with ❤️ using Next.js, Tailwind, Node.js & OpenAI
      </footer>
    </div>
  );
}
