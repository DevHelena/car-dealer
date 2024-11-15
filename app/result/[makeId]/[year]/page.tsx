"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ICarModel, returnHeader } from "../../../types/apisReturns";

type props = {
  makeId: string;
  year: string;
};

type paramsUrl = {
  params: {
    makeId: string;
    year: string;
  };
};


const API_ROOT = process.env.NEXT_PUBLIC_API_URL_VEHICLE;

const fetchData = async ({makeId, year}: props): Promise<ICarModel[]> => {
  try {
    const response = await fetch(`${API_ROOT}/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`);

    const data: returnHeader<ICarModel> = await response.json();
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

export default function Home({ params }: paramsUrl) {
  const { makeId, year } = params;
  const router = useRouter();
  const [data, setData] = useState<ICarModel[] | null>(null);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const result = await fetchData({ makeId, year });
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

  return (
    <Suspense fallback={<Loading />}>
      {!data ? (
        <Loading />
      ) : (
        <>
        {data.length > 0 ? (
          <section className="overflow-x-auto bg-white shadow-md rounded-lg p-6 w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{`${data[0].Make_Name} car models ${year}`}</h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-6 py-3 text-left">Model ID</th>
                  <th className="px-6 py-3 text-left">Model Name</th>
                </tr>
              </thead>
              <tbody>
                {data.map((model) => (
                  <tr key={model.Model_ID} className="border-t hover:bg-gray-100">
                    <td className="px-6 py-4">{model.Model_ID}</td>
                    <td className="px-6 py-4">{model.Model_Name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500 mb-4">We didn't find models for this brand and year... :(</p>
            <Link
              href="/"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
            >
              Go Back to Home
            </Link>
          </div>
        )}
      </>
      )}
    </Suspense>
  );
}

