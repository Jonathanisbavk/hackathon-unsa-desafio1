# CONECTA UNSA - Plataforma de Empleo Inteligente

**Desafío Hackathon UNSA 2026**
Un portal moderno, inteligente e institucional para conectar a los egresados de la Universidad Nacional de San Agustín con oportunidades laborales, impulsado por IA.

## 🚀 Características Principales (MVP)

1. **Onboarding Inteligente (Prompt 1 & 2)**
   - Autenticación segura con Supabase.
   - Flujo de 3 pasos: Perfil, Intereses (escuelas y modalidades) y Filtro de Transparencia Salarial.
   - Acceso Demo "Sin Correo" implementado.

2. **Pipeline de Extracción con IA (Prompt 3)**
   - Edge Function (Route Handler) que analiza correos crudos.
   - **Gemini 2.0 Flash** como extractor principal, con un **fallback a Groq Llama 3.1 70B** para tolerancia a fallos.
   - Detección automática de ruido (tesis, spam).
   - Generación de "Mensaje Nudge" sugiriendo transparencia salarial si falta el sueldo.

3. **Panel de Administrador (Prompt 4)**
   - Experiencia de operario en una sola pantalla.
   - Procesa y estandariza texto crudo en un clic.

4. **Motor de Embeddings y Alertas (Prompt 5)**
   - Usa `text-embedding-004` para convertir la oferta a vectores espaciales en la BD (`pgvector`).
   - Dispara notificaciones instantáneas y previene duplicados.

5. **Dashboard, Feed y Búsqueda Interactiva (Prompt 6)**
   - Feed dinámico que aplica el filtro de "Solo ofertas con sueldo".
   - Alertas personalizadas: el egresado puede suscribirse a palabras clave (ej: "React", "Minas").
   - Campanita de notificaciones in-app.

6. **Recomendaciones Semánticas (Prompt 7)**
   - Match inteligente: Se calcula el embedding del perfil del estudiante y se compara usando similitud de coseno contra todas las ofertas publicadas.
   - Muestra el Top 3 de recomendaciones predictivas al inicio del Dashboard.

## 🛠 Stack Tecnológico
- **Frontend**: Next.js 16 (App Router), TailwindCSS, React.
- **Backend / DB**: Supabase (PostgreSQL + pgvector).
- **IA**: Gemini API (Flash 2.0 y Embeddings), Groq (Llama 3.1).
- **Deploy**: Vercel (Auto-deploy conectado a la rama main).

## 🌍 Demostración
El proyecto está en vivo y funcional:
**URL de Vercel**: [https://hackathon-unsa-desafio1.vercel.app](https://hackathon-unsa-desafio1.vercel.app)

*(Usa el botón "Entrar a la Demo" para visualizar el portal sin necesidad de autenticarte).*

## 💻 Variables de Entorno (.env.example)
Revisa el archivo `.env.example` para conocer las variables necesarias si deseas correrlo en local.
