import { NextRequest, NextResponse } from 'next/server';
import { transformBuilderQueryResponse } from '@utils/transformBuilderQueryResponse';

export const dynamic = 'force-dynamic';

const BUILDER_UPSTREAM = 'https://cdn.builder.io';

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const isQueryContentPath = (pathname: string) => {
  return /\/api\/v\d+\/query\//.test(pathname);
};

const extractCustomData = (
  params: URLSearchParams
): { customData: Record<string, unknown>; replaceFallback?: string } => {
  const result: {
    customData: Record<string, unknown>;
    replaceFallback?: string;
  } = { customData: {}, replaceFallback: undefined };

  for (const key of Array.from(params.keys())) {
    if (!key.endsWith('.query')) continue;

    try {
      const parsed = JSON.parse(params.get(key) || '{}');

      if (parsed?.customData) {
        Object.assign(result.customData, parsed.customData);
        delete parsed.customData;
      }

      if (!!parsed.replaceFallback) {
        result.replaceFallback = parsed.replaceFallback;
        delete parsed.replaceFallback;
      }

      Object.keys(parsed).length
        ? params.set(key, JSON.stringify(parsed))
        : params.delete(key);
    } catch {
      console.error(
        `Error parsing custom data for key: ${key}, value: ${params.get(key)}`
      );
    }
  }
  return result;
};

async function forwardRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  if (!path?.length) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }

  const expectedKey = process.env.NEXT_PUBLIC_BUILDERIO;
  const apiKeySegment = path[3];
  if (expectedKey && apiKeySegment && apiKeySegment !== expectedKey) {
    return NextResponse.json({ error: 'Invalid api key' }, { status: 403 });
  }

  const pathname = `/${path.join('/')}`;
  const upstreamUrl = new URL(pathname, BUILDER_UPSTREAM);

  const incomingParams = new URLSearchParams(request.nextUrl.searchParams);
  const { customData, replaceFallback } = extractCustomData(incomingParams);

  upstreamUrl.search = incomingParams.toString();

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  const auth = request.headers.get('authorization');
  if (auth) {
    headers['Authorization'] = auth;
  }
  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  const method = request.method.toUpperCase();
  const hasBody = !['GET', 'HEAD'].includes(method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const upstream = await fetch(upstreamUrl.toString(), {
    method,
    headers,
    body,
    cache: 'no-store',
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'text/plain',
      },
    });
  }

  const upstreamContentType = upstream.headers.get('content-type') ?? '';
  if (!upstreamContentType.includes('application/json')) {
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: upstream.status,
      headers: { 'content-type': upstreamContentType },
    });
  }
  const json = (await upstream.json()) as Record<string, unknown>;

  if (isQueryContentPath(pathname)) {
    const transformed = transformBuilderQueryResponse(
      json,
      customData,
      replaceFallback
    );
    return NextResponse.json(transformed);
  }

  return NextResponse.json(json);
}

export async function GET(req: NextRequest, context: RouteContext) {
  return forwardRequest(req, context);
}

export async function POST(req: NextRequest, context: RouteContext) {
  return forwardRequest(req, context);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return forwardRequest(req, context);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  return forwardRequest(req, context);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  return forwardRequest(req, context);
}

export async function OPTIONS(req: NextRequest, context: RouteContext) {
  return forwardRequest(req, context);
}
