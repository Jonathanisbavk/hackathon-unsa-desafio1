import Link from "next/link";
import AppHeader from "@/components/app-header";
import { ConectaLogo } from "@/components/brand/logo";

export const metadata = {
  title: "Políticas de Privacidad — CONECTA UNSA",
};

export default function PoliticasPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <AppHeader
        left={
          <Link href="/" className="flex items-center gap-3">
            <ConectaLogo size={32} />
            <div>
              <p className="font-bold leading-none text-zinc-900 dark:text-white">CONECTA</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-unsa-primary">UNSA</p>
            </div>
          </Link>
        }
        right={
          <Link
            href="/"
            className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            ← Volver al inicio
          </Link>
        }
      />

      <main className="flex-grow p-4 sm:p-8 lg:p-12">
        <article className="mx-auto max-w-3xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-12">
          <div className="mb-8 border-b border-zinc-100 pb-8 dark:border-zinc-800">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Política de Privacidad y Tratamiento de Datos Personales
            </h1>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Última actualización: {new Date().toLocaleDateString("es-PE")}
            </p>
          </div>

          <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-unsa-primary">
            <p>
              De conformidad con lo establecido en la <strong>Ley N° 29733, Ley de Protección de Datos Personales</strong>,
              su Reglamento aprobado por el Decreto Supremo N° 003-2013-JUS, y las normas complementarias del Perú, 
              <strong> CONECTA UNSA</strong> pone en conocimiento de sus usuarios (en adelante, los "Titulares de los Datos Personales")
              la presente Política de Privacidad.
            </p>

            <h2>1. Identidad y Domicilio del Titular del Banco de Datos</h2>
            <p>
              El titular del banco de datos personales y responsable del tratamiento es <strong>CONECTA UNSA</strong>, 
              iniciativa de innovación tecnológica para la Universidad Nacional de San Agustín de Arequipa (UNSA), 
              domiciliada en Arequipa, Perú.
            </p>

            <h2>2. Finalidad del Tratamiento de los Datos Personales</h2>
            <p>
              Los datos personales y la información contenida en el Currículum Vitae (CV) u otros formularios proporcionados
              por el usuario serán utilizados exclusivamente para las siguientes finalidades:
            </p>
            <ul>
              <li><strong>Análisis de perfiles:</strong> Utilizar modelos de Inteligencia Artificial para extraer, estructurar y resumir las habilidades y experiencias del usuario.</li>
              <li><strong>Matching laboral:</strong> Calcular la similitud semántica (mediante embeddings) entre el perfil del usuario y las ofertas laborales vigentes.</li>
              <li><strong>Notificaciones y alertas:</strong> Enviar correos electrónicos con ofertas de trabajo personalizadas basadas en las áreas de interés y palabras clave seleccionadas.</li>
              <li><strong>Mejora del servicio:</strong> Analizar estadísticas anonimizadas para mejorar el motor de recomendación de CONECTA UNSA.</li>
            </ul>

            <h2>3. Datos Personales Recopilados</h2>
            <p>Para cumplir con las finalidades descritas, recopilamos y procesamos la siguiente información:</p>
            <ul>
              <li><strong>Datos identificativos:</strong> Nombres, apellidos, correo electrónico.</li>
              <li><strong>Datos académicos y profesionales:</strong> Carreras, escuelas de interés, historial laboral, años de experiencia, habilidades técnicas (skills) extraídas del CV.</li>
              <li><strong>Datos generados:</strong> Vectores matemáticos (embeddings) que representan semánticamente el perfil profesional del usuario.</li>
            </ul>

            <h2>4. Transferencia y Almacenamiento de Datos</h2>
            <p>
              Los datos son almacenados en servidores seguros en la nube. Para el procesamiento inteligente, la información contenida
              en el CV es analizada de forma temporal mediante APIs de Inteligencia Artificial (ej. Google Gemini), garantizando
              que el uso de estos datos sea estrictamente para la extracción estructurada requerida y no para entrenar modelos públicos.
            </p>

            <h2>5. Plazo de Conservación</h2>
            <p>
              Los datos personales se conservarán mientras el usuario mantenga su cuenta activa en CONECTA UNSA o siga suscrito
              a las alertas de correo. El usuario puede solicitar la eliminación de su información en cualquier momento.
            </p>

            <h2>6. Derechos ARCO</h2>
            <p>
              Los Titulares de los Datos Personales pueden ejercer en todo momento sus derechos de <strong>Acceso, Rectificación, Cancelación y Oposición (Derechos ARCO)</strong>. 
              Para ello, podrán dirigir su solicitud a través de los canales de atención o soporte de la plataforma CONECTA UNSA.
            </p>

            <h2>7. Seguridad y Confidencialidad</h2>
            <p>
              CONECTA UNSA adopta las medidas técnicas, organizativas y legales necesarias para proteger la información personal de
              pérdidas, mal uso, alteraciones, acceso no autorizado y robo, de acuerdo con los niveles de seguridad exigidos por la Ley.
            </p>

            <h2>8. Consentimiento</h2>
            <p>
              Al hacer clic en la casilla <em>"He leído y acepto la Política de Privacidad"</em>, el usuario brinda su 
              consentimiento previo, libre, expreso, inequívoco e informado para que CONECTA UNSA trate sus datos personales 
              conforme a las finalidades descritas en esta política.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
