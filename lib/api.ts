import { NextRequest } from "next/server";

/**
 * apiFetch - universal fetch for dev/prod that prefixes API calls with the correct base URL
 *
 * Usage:
 *   apiFetch('/users', { method: 'GET' })
 *   apiFetch('https://external.com/endpoint') // untouched
 */

export async function apiFetch<TResponse>(
  path: string,
  init?: RequestInit & {
    queryParams?: Record<string, string | number | boolean | undefined | null>;
  }
): Promise<TResponse> {
  try {
    let url = path;

    if (init?.queryParams) {
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(init.queryParams)) {
        if (value === undefined || value === null || value === "") {
          continue;
        }
        queryParams.append(key, String(value));
      }
      url = `${url}?${queryParams.toString()}`;
    }

    console.log(url);

    const res = await fetch(url as RequestInfo, init);

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        // Ignore json parse error
      }

      if (errorData) {
        throw errorData;
      }

      throw new Error(res.statusText);
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}

export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    //|| request.socket.remoteAddress
    "unknown"
  );
}
