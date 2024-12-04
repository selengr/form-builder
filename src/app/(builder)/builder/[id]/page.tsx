"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { formResDataTypes } from "@/types/bulider";
import BuilderLoading from "./loading";
import FormBuilderMiddleware from "@/templates/builder/FormBuilderMiddleware";
import AxiosApi from "@/services/axios/AxiosApi";

export default function BuilderPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState<formResDataTypes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await AxiosApi.get(`/form/${id}`);
        setFormData(response.data as formResDataTypes);
      } catch (err) {
        console.log(err);
        setError("Form not found");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  if (loading) {
    return <BuilderLoading />;
  }

  if (error) {
    notFound();
  }

  return <FormBuilderMiddleware formData={formData as formResDataTypes} />;
}
