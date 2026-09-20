export async function POST() {
  return new Response(
    "<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex,nofollow,noarchive\"><title>Feed posting disabled</title></head><body style=\"font-family:Arial,sans-serif;padding:48px;background:#f4f0e7;color:#173039\"><main style=\"max-width:720px;margin:auto;background:white;padding:36px;border:1px solid #d7dfdc\"><h1>Feed posting is disabled</h1><p>Haris Content Publisher has been changed to a native LinkedIn Article workflow. It no longer creates feed posts.</p><p><a href=\"/api/linkedin/publisher\">Open LinkedIn Article Studio</a></p></main></body></html>",
    {
      status: 410,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive"
      }
    }
  );
}

export function GET() {
  return new Response(null, { status: 302, headers: { Location: "/api/linkedin/publisher", "Cache-Control": "no-store" } });
}
