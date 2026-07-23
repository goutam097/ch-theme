import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/v1";

function getAccessToken(payload: Record<string, unknown>, fallback: string) {
  return (
    (payload?.token as string | undefined) ??
    (payload?.accessToken as string | undefined) ??
    ((payload?.data as Record<string, unknown> | undefined)?.token as string | undefined) ??
    ((payload?.data as Record<string, unknown> | undefined)?.accessToken as string | undefined) ??
    fallback
  );
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("value");

  if (!token) {
    return NextResponse.json({ error: "Missing SSO token" }, { status: 400 });
  }

  try {
    const authResponse = await axios.get(`${API_BASE_URL}/auth/user-token`, {
      params: { value: token },
      headers: { Accept: "application/json" },
    });
    console.log(authResponse,'authResponse')

    const authPayload = authResponse.data ?? {};
    const accessToken = getAccessToken(authPayload, token);

    const profileResponse = await axios.get(`${API_BASE_URL}/user-profile/details`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(profileResponse,'profileResponse')

    return NextResponse.json({
      token: accessToken,
      profile: profileResponse.data ?? {},
      auth: authPayload,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      const message = error.response?.data?.error || error.message;
      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to complete sign-in" },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
