export type ApiErrorBody = {
  message: string;
  errors?: Record<string, string[]>;
};

export class ApiClientError extends Error {
  errors?: Record<string, string[]>;

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiClientError";
    this.errors = errors;
  }
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = data as ApiErrorBody;
    throw new ApiClientError(
      err.message || "Something went wrong",
      err.errors
    );
  }

  return data as T;
}
