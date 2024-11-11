"use client";
import React from "react";
import { ChangeEvent, useEffect, useState } from "react";

export default function EditPages({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [formData, setFormData] = useState({ term: "", interpretation: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("Error Updated");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/interpretations/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch interpretation");
        }
        const data = await response.json();
        setFormData({
          term: data.interpretation.term,
          interpretation: data.interpretation.interPretation,
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
      <form className="flex gap-3 flex-col">
        <input
          type="text"
          name="term"
          placeholder="Term"
          className="py-1 px-4 border rounded-md"
          value={formData.term}
          onChange={handleInputChange}
        />
        <textarea
          name="interPretation"
          rows={4}
          placeholder="interPretation"
          className="py-1 px-4 border rounded-md resize-none"
          value={formData.interpretation}
          onChange={handleInputChange}
        ></textarea>
        <button className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer">
          Update TechInfo
        </button>
      </form>
    </div>
  );
}
