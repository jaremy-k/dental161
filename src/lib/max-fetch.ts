import https from "node:https";
import { RUSSIAN_TRUSTED_CA_BUNDLE } from "@/lib/russian-trusted-ca";

const russianCaAgent = new https.Agent({
  ca: RUSSIAN_TRUSTED_CA_BUNDLE,
  keepAlive: true,
});

type HttpsJsonResponse = {
  statusCode: number;
  body: string;
};

export function httpsPostJson(
  url: string | URL,
  headers: Record<string, string>,
  body: unknown,
): Promise<HttpsJsonResponse> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url.toString());
    const payload = JSON.stringify(body);

    const req = https.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || 443,
        path: `${parsed.pathname}${parsed.search}`,
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
        agent: russianCaAgent,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode ?? 0,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}
