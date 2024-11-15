"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IMake, returnHeader } from "./types/apisReturns";

const API_ROOT = process.env.NEXT_PUBLIC_API_URL_VEHICLE;

const fetchData = async (): Promise<IMake[]> => {
  try {
    const response = await fetch(`${API_ROOT}/GetMakesForVehicleType/car?format=json`);

    const data: returnHeader<IMake> = await response.json();
    return data.Results;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
};

const Loading = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
    <p className="ml-4">Loading...</p>
  </div>
);

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<IMake[] | null>(null);
  const [error, setError] = useState(false);
  const [makeName, setMakeName] = useState<string>();
  const [year, setYear] = useState<string>();
  const startYear = 2015;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => (startYear + i).toString());
  
  const isButtonDisabled = !makeName || !year;
  
  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const result = await fetchData();
        setData(result);
      } catch (err) {
        setError(true);
      }
    };
    fetchDataAsync();
  }, []);

  if (error) {
    router.push("/500");
    return null;
  };

  const handleNext = () => {
    router.push(`/result/${makeName}/${year}`);
  };

  return (
    <Suspense fallback={<Loading />}>
      {!data ? (
        <Loading />
      ) : (
        <section className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Search Cars</h2>
    
          <div className="mb-4">
            <label
              htmlFor="vehicle-makes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Vehicle Makes
            </label>
            <select
              id="vehicle-makes"
              value={makeName}
              onChange={(e) => setMakeName(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Make</option>
              {data.map((make) => (
                <option key={make.MakeId} value={make.MakeId}>
                  {make.MakeName}
                </option>
              ))}
            </select>
          </div>
    
          <div className="mb-4">
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Year</option>
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
    
          <Link
            href={`/result/${makeName}/${year}`}
            className={`block text-center py-2 rounded-md font-semibold text-white transition ${
              isButtonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Next
          </Link>
        </section>
      )}
    </Suspense>
  );
}

