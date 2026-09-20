export default function handler(req, res) {
  const hasCode = Boolean(req.query?.code);
  const hasError = Boolean(req.query?.error);

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    ok: true,
    service: "Haris Content Publisher",
    callbackReady: true,
    authorizationResponseReceived: hasCode || hasError
  });
}
