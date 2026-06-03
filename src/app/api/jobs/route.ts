import { jsonError, jsonOk } from "@/lib/api-response";
import { listJobs } from "@/lib/jobs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const result = await listJobs(query);
    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
