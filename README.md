# Growth Agent Suite MVP

SaaS B2B diseñado para *Growth Operators* y agencias, enfocado en automatizar y escalar el contacto, calificación y agendamiento de leads a través de Instagram DM usando agentes de Inteligencia Artificial (RAG) con un diseño **Cinematográfico y Premium**.

---

## 🎨 Guía de Personalización de Diseño (Cinematic UI)

El frontend ha sido diseñado usando **Next.js 14**, **Tailwind CSS v4** y un estilo de *Glassmorphism* sobre fondos oscuros inspirados en la naturaleza.

### 1. ¿Cómo cambiar los Colores Principales?
Los colores de la paleta están definidos de forma global en dos partes:
1. **En Tailwind:** Abre el archivo `tailwind.config.ts`. Encontrarás el objeto `theme.extend.colors.cinematic`. Para cambiar el verde principal, modifica el valor de `cinematic.primary` y `pine.500`.
2. **En CSS Global:** Abre `src/app/globals.css`. Allí las variables en `@theme` como `--color-cinematic-deep` controlan los fondos y gradientes oscuros. Cambia el `--background-hero-gradient` si deseas un tinte que no sea verde oscuro.

### 2. ¿Cómo cambiar las Imágenes de Fondo (Bosque / Océano)?
En la Landing Page (`src/app/page.tsx`), las secciones de "Casos de Uso" y el "Hero Fullscreen" usan imágenes como fondo para dar la vibra fotográfica.
Actualmente el código busca las imágenes en tu carpeta pública local:
- `/public/forest-bg.jpg` (Fondo del Hero superior)
- `/public/ocean-bg.jpg` (Fondo del Caso de Uso 1)
- `/public/wild-bg.jpg` (Fondo del Caso de Uso 2)

**Para usar tus propias imágenes:**
1. Ve a la carpeta `public/` en la raíz de tu proyecto.
2. Arrastra y suelta tus fotos allí asegurándote de que tengan formato ancho (Ej. 1920x1080) para que se vean bien.
3. Renómbralas a `forest-bg.jpg`, `ocean-bg.jpg` o cambia los nombres directamente en el archivo `src/app/page.tsx`.

*(Nota: Dejé colores de respaldo configurados, por lo que si las imágenes no existen, se verá un elegante fondo color pino / azul profundo por defecto).*

### 3. Modificar Textos de la Landing
Para cambiar la propuesta de valor, los subtítulos o los botones:
1. Abre `src/app/page.tsx`.
2. Busca la etiqueta `<h1>`. Allí verás el texto *"Conecta el Océano Azul de tu Audiencia"*.
3. Todas las descripciones de los botones y textos están en código duro en este archivo para que puedas ajustarlos libremente a tu *copywriting* ideal.

### 4. Componentes Reutilizables
Si quieres crear nuevas pantallas con este mismo estilo, puedes importar nuestros componentes:
```tsx
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";

// Uso básico:
<GlassCard strong glow>
   <SectionTitle title="Métricas" />
   <Button variant="primary">Continuar</Button>
</GlassCard>
```

---

## 🚀 Despliegue y Local

1. Configura tu `.env` (Copiar de `.env.example`).
2. Genera el cliente de DB de Prisma: `npx prisma generate`.
3. Para correr localmente: `npm run dev`.
4. El proyecto está listo para subir a GitHub y conectarse a **Vercel** (`npm run build` verificado).
