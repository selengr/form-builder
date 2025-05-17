"use client";
import FormCardBase from "@/components/common/FormCardBase";

export default function ListCard(props: any) {

  return (
      <FormCardBase data={props.data} buttonText="شرکت در آزمون" buttonLink={`/form/${props.data.id}`} />
  );
}
