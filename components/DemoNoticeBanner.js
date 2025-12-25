"use client";

export default function DemoNoticeBanner() {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-2 text-sm">
          <svg
            className="w-5 h-5 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-yellow-800 font-medium">
            🎨 Demo Mode - Portfolio Project
          </span>
          <span className="text-yellow-700 hidden sm:inline">
            | Use test card:{" "}
            <code className="bg-yellow-100 px-2 py-1 rounded">
              4242 4242 4242 4242
            </code>
          </span>
        </div>
      </div>
    </div>
  );
}
