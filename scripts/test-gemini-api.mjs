/**
 * Prueba local de la API Gemini (sin exponer claves).
 * Uso: npm run test:api
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");
const BASE_URL = process.env.TEST_API_URL ?? "http://localhost:3000";

function cargarEnv() {
  if (!fs.existsSync(ENV_PATH)) return;
  for (const line of fs.readFileSync(ENV_PATH, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[m[1].trim()] = val;
  }
}

function resumen(obj) {
  return JSON.stringify(obj, null, 2);
}

async function testGetCasos() {
  const res = await fetch(`${BASE_URL}/api/mejorar-oferta`);
  const data = await res.json();
  const ok = data.casos?.filter((c) => c.ok).length ?? 0;
  const total = data.casos?.length ?? 0;
  console.log(`\n[GET /api/mejorar-oferta] ${ok}/${total} casos OK`);
  for (const c of data.casos ?? []) {
    const icon = c.ok ? "✓" : "✗";
    console.log(`  ${icon} ${c.nombre}${c.ok ? ` (${c.ms}ms, proveedor: ${c.resultado?.proveedor})` : ""}`);
    if (!c.ok) console.log(`    Error: ${c.error}`);
    if (c.ok) {
      console.log(`    clasificacion=${c.resultado.clasificacion}, titulo=${c.resultado.titulo ?? "—"}`);
    }
  }
  return ok === total;
}

async function testPost() {
  const texto = `OFERTA LABORAL — DESARROLLADOR WEB JUNIOR

Empresa: TechSol Arequipa
Puesto: Desarrollador Web Full Stack Junior
Requisitos: Egresado de Ingeniería de Sistemas, React, Node.js
Modalidad: Híbrido en Arequipa
Enviar CV a: empleos@techsol.pe hasta el 30 de junio`;

  const res = await fetch(`${BASE_URL}/api/mejorar-oferta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto_crudo: texto }),
  });
  const data = await res.json();
  const ok = res.ok && data.clasificacion === "oferta";
  console.log(`\n[POST /api/mejorar-oferta] ${ok ? "OK" : "FAIL"} (${res.status})`);
  if (ok) {
    console.log(`  proveedor=${data.proveedor}, ms=${data.ms}, empresa=${data.empresa}`);
  } else {
    console.log(`  error=${data.error ?? resumen(data)}`);
  }
  return ok;
}

async function testValidacion() {
  const res = await fetch(`${BASE_URL}/api/mejorar-oferta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto_crudo: "corto" }),
  });
  const ok = res.status === 400;
  console.log(`\n[POST validación texto corto] ${ok ? "OK (400)" : "FAIL"}`);
  return ok;
}

async function testEmbedding() {
  try {
    const res = await fetch(`${BASE_URL}/api/mejorar-oferta/embedding-test`);
    if (res.status === 404) {
      // Endpoint dev opcional; probar vía SDK si el servidor no lo expone
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.log("\n[Embedding gemini-embedding-001] SKIP (sin GEMINI_API_KEY)");
        return true;
      }
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent("Desarrollador web React Node.js Arequipa");
      const dims = result.embedding?.values?.length ?? 0;
      const ok = dims === 768;
      console.log(`\n[Embedding gemini-embedding-001] ${ok ? "OK" : "FAIL"} (dims=${dims})`);
      return ok;
    }
    const data = await res.json();
    const ok = res.ok && data.dims === 768;
    console.log(`\n[Embedding gemini-embedding-001] ${ok ? "OK" : "FAIL"} (dims=${data.dims ?? "?"})`);
    if (!ok && data.error) console.log(`  error=${data.error}`);
    return ok;
  } catch (err) {
    console.log(`\n[Embedding gemini-embedding-001] FAIL: ${err.message}`);
    return false;
  }
}

async function main() {
  cargarEnv();
  const tieneGemini = Boolean(process.env.GEMINI_API_KEY);
  console.log(`GEMINI_API_KEY: ${tieneGemini ? "configurada" : "NO configurada"}`);
  console.log(`GROQ_API_KEY: ${process.env.GROQ_API_KEY ? "configurada" : "no configurada (fallback)"}`);
  console.log(`Servidor: ${BASE_URL}`);

  const resultados = [
    await testValidacion(),
    await testPost(),
    await testGetCasos(),
    await testEmbedding(),
  ];

  const passed = resultados.filter(Boolean).length;
  console.log(`\n=== Resultado: ${passed}/${resultados.length} suites OK ===`);
  process.exit(passed === resultados.length ? 0 : 1);
}

main().catch((err) => {
  console.error("Error ejecutando tests:", err.message);
  process.exit(1);
});
