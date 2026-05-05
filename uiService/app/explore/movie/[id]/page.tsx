import { API_USER_URL } from "@/utils/config";
import Moviescreen from "@/components/movie/movie";

const getMovieDetails = async (id: string) => {
  const res = await fetch(`${API_USER_URL}/getSingleMovie/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch movie");
  const json = await res.json();
  return json.data;
};

export default async function Movie({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ MATCH what Next expects
}) {
  const { id } = await params; // ✅ await it

  const movie = await getMovieDetails(id);

  return <Moviescreen movie={movie} />;
}