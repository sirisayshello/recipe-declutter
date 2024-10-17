import Link from "next/link";

export default function Recipe({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div>
      <h1>Recipe Details</h1>
      <Link href={`/dashboard/${id}/edit`}>Edit recipe</Link>{" "}
    </div>
  );
}
