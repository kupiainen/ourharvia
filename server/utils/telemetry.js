
async function getFetch() {
  return globalThis.fetch ?? (await import("node-fetch")).default;
}

export async function discoverEndpoints(fetchFn) {
  const resp = await fetchFn("https://prod.api.harvia.io/endpoints");
  if (!resp.ok) {
    throw new Error(`endpoint discovery failed: ${resp.status}`);
  }

  const json = await resp.json();
  const ep = json?.endpoints;
  if (!ep) throw new Error("no endpoints returned from discovery");

  const apiBase = ep?.RestApi?.data?.https;
  const apiGen = ep?.RestApi?.generics?.https;
  if (!apiBase || !apiGen) throw new Error("RestApi endpoints missing");

  return { apiBase, apiGen };
}

export async function getIdToken(fetchFn, apiGen, creds) {
  const resp = await fetchFn(`${apiGen}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(creds),
  });

  if (!resp.ok) {
    throw new Error(`token request failed: ${resp.status}`);
  }

  const { idToken } = await resp.json();
  if (!idToken) throw new Error("idToken missing");
  return idToken;
}

/* -------------------------------------------------------
   3. Authenticated REST wrapper
-------------------------------------------------------- */
export function createRestCaller(fetchFn, apiBase, idToken) {
  return async function call(method, path) {
    const res = await fetchFn(`${apiBase}${path}`, {
      method,
      headers: { Authorization: `Bearer ${idToken}` },
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${await res.text()}`);
    }

    return res.json();
  };
}

/* -------------------------------------------------------
   4. Final query function (calls the above helpers)
-------------------------------------------------------- */
export async function queryHarviaTelemetry(from, to, deviceId, cabinId, creds, opts = {}) {
  const fetchFn = await getFetch();

  // Step 1: Discover endpoints
  const { apiBase, apiGen } = await discoverEndpoints(fetchFn);

  // Step 2: Get token
  const idToken = await getIdToken(fetchFn, apiGen, creds);

  // Step 3: Create authenticated REST caller
  const call = createRestCaller(fetchFn, apiBase, idToken);

  // Step 4: Build telemetry query
  const telemetryPath =
    `/data/telemetry-history` +
    `?deviceId=${encodeURIComponent(deviceId)}` +
    `&cabinId=${encodeURIComponent(cabinId)}` +
    `&startTimestamp=${encodeURIComponent(from)}` +
    `&endTimestamp=${encodeURIComponent(to)}` +
    `&samplingMode=${encodeURIComponent(opts.samplingMode ?? "average")}` +
    `&sampleAmount=${encodeURIComponent(opts.sampleAmount ?? 60)}`;

  return call("GET", telemetryPath);
}
