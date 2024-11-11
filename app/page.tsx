"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface InterPretation {
  $id: string;
  term: string;
  interpretation: string;
}

export default function Home() {
  const [interPretations, setInterPretations] = useState<InterPretation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterpretation = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("api/interpretations");
        if (!response.ok) {
          throw new Error("Failed to fetch interpretations");
        }
        const data = await response.json();
        setInterPretations(data);
      } catch (error) {
        console.log("Error:", error);
        setError("Failed to load interpretations. please try reloading page");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterpretation();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/interpretations/${id}`, { method: "DELETE" });
      setInterPretations((PrevInterPretation) =>
        PrevInterPretation?.filter(
          (interpretationId) => interpretationId.$id !== id
        )
      );
    } catch (error) {
      setError("Failed to delete interpretation, Please try again");
    }
  };
  return (
    <div className="">
      {error && <p className="py-4 text-red-500">{error}</p>}
      {isLoading ? (
        <p>Loading interpretation...</p>
      ) : interPretations.length > 0 ? (
        <div>
          {interPretations?.map((interPretation) => (
            <div
              className="p-4 my-2 rounded-md border-b leading-9"
              key={interPretation.$id}
            >
              <div className="font-bold">{interPretation.term}</div>
              <div>{interPretation.interpretation}</div>
              <div className="flex gap-4 mt-4 justify-end">
                <Link
                  href={`/edit/${interPretation.$id}`}
                  className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(interPretation.$id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No interpretation found</p>
      )}
    </div>
  );
}
