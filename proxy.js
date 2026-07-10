import { NextResponse } from "next/server";

function isAuthEnabled() {
  return Boolean(process.env.INNERSCRIPT_AUTH_USERNAME && process.env.INNERSCRIPT_AUTH_PASSWORD);
}

function decodeBasicAuth(header) {
  if (!header?.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(header.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export function proxy(request) {
  if (!isAuthEnabled()) {
    return NextResponse.next();
  }

  const credentials = decodeBasicAuth(request.headers.get("authorization"));
  const allowed =
    credentials?.username === process.env.INNERSCRIPT_AUTH_USERNAME &&
    credentials?.password === process.env.INNERSCRIPT_AUTH_PASSWORD;

  if (allowed) {
    return NextResponse.next();
  }

  return new Response("Authentication required", {
    status: 401,
    headers: {
      "www-authenticate": 'Basic realm="InnerScript"',
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|file.svg|globe.svg|next.svg|vercel.svg|window.svg|mockServiceWorker.js).*)",
  ],
};
