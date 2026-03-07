"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin route error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-neutral-900">
        Ha ocurrido un error
      </h1>

      <p className="text-neutral-500 mt-2 max-w-md">
        Se ha producido un error inesperado. Por favor, intentalo de nuevo.
      </p>

      <button
        onClick={reset}
        className="mt-8 px-6 py-2.5 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer rounded"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
