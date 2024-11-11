"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { ChangeEvent, useEffect, useState } from "react";

export default function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [formData, setFormData] = useState({ term: "", interpretation: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.term || !formData.interpretation) {
      setError("Please fill in all the fields");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/interpretations/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("failed to update interpretation");
      }
      router.push("/");
    } catch (error) {
      console.log(error);
      setError("Something Went Wrong.Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/interpretations/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch interpretation");
        }
        const data = await response.json();
        console.log(data);
        setFormData({
          term: data.interpretation.term || "",
          interpretation: data.interpretation.interpretation || "",
        });
      } catch (error) {
        setError("Failed to load interpretation");
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Edit NewInfo</h2>
      <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
        <input
          type="text"
          name={"term"}
          placeholder="Term"
          className="py-1 px-4 border rounded-md"
          value={formData.term || ""}
          onChange={handleInputChange}
        />
        <textarea
          name={"interpretation"}
          rows={4}
          placeholder="interPretation"
          className="py-1 px-4 border rounded-md resize-none"
          value={formData.interpretation || ""}
          onChange={handleInputChange}
        ></textarea>
        <button className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer">
          {isLoading ? "Updating..." : "UpdateInfo"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
