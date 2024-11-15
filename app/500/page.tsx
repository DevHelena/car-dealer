"use client";
import { Suspense } from "react";
import Link from "next/link";

const Loading = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
    <p className="ml-4">Loading...</p>
  </div>
);

export default function Error500Page() {
  return (
    <Suspense fallback={<Loading />}>
        <div className="text-center py-10">
          <p className="text-lg text-gray-500 mb-4">Ops! It looks like an error occurred :/</p>
          <Link
              href="/"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
          >
              Go Back to Home
          </Link>
        </div>
    </Suspense>
  );
}

