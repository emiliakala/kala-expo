# Kala Expo China · Deploy paso a paso

Esta guía te lleva de cero a tener la app funcionando en el celular de todo el equipo en unos 15 minutos. **Todo gratis.**

---

## PASO 1 · Crear cuenta en GitHub (si no tenés)

1. Abrí **https://github.com**
2. Tocá "Sign up" (arriba a la derecha)
3. Email, contraseña, username (ej: `kala-aromas`)
4. Verificá el email
5. Listo

---

## PASO 2 · Crear el repositorio y subir los archivos

1. Logueada en GitHub, tocá **"+"** arriba a la derecha → **"New repository"**
2. Repository name: `kala-expo`
3. Dejá "Public" marcado
4. **NO** marques "Add a README", ".gitignore", ni "license"
5. Tocá **"Create repository"**

En la pantalla siguiente vas a ver un texto que dice *"Get started by creating a new file or uploading an existing file."*

Tocá el link **"uploading an existing file"**.

**Descomprimí el ZIP `kala-expo-deploy.zip`**. Vas a ver una carpeta `kala-expo` con estos archivos:

- `.gitignore`
- `DEPLOY_INSTRUCCIONES.md`
- `next.config.js`
- `package.json`
- Carpeta `app/` (con `layout.js`, `page.js`, y subcarpeta `api/`)

**Seleccioná TODO el contenido de la carpeta y arrastralo** al área punteada de GitHub. IMPORTANTE: subís el **contenido**, no la carpeta en sí.

Esperá a que suban todos. Scrolleá hasta abajo y tocá **"Commit changes"**.

---

## PASO 3 · Crear cuenta en Vercel

1. Abrí **https://vercel.com**
2. Tocá **"Sign Up"**
3. Elegí **"Continue with GitHub"**
4. Autorizá
5. Plan: elegí **"Hobby"** (gratis, sin tarjeta)

---

## PASO 4 · Deployar

1. Dashboard de Vercel → **"Add New..."** → **"Project"**
2. Buscá `kala-expo` en la lista y tocá **"Import"**
3. No cambies nada, Vercel detecta Next.js automáticamente
4. Tocá **"Deploy"**
5. Esperá 1-2 minutos

Cuando termine vas a ver confeti y una URL tipo `kala-expo-xxx.vercel.app`.

**Abrila en el celular** — la app funciona pero la IA va a dar error porque falta la API key.

---

## PASO 5 · API key de Anthropic

1. **https://console.anthropic.com**
2. Creá cuenta (podés usar el mismo email)
3. Menú lateral → **"API keys"** → **"Create Key"**
4. Nombre: `kala-expo`
5. **Copiá la key AHORA MISMO** (empieza con `sk-ant-api03-...`). Solo se muestra una vez.
6. Menú → **"Plans & Billing"** → **"Add credits"**. USD 5-10 alcanza para toda la Expo.

Volvé a Vercel:

1. Tu proyecto `kala-expo` → **Settings** → **Environment Variables**
2. Agregar nueva variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: la key que copiaste
3. Guardar
4. **"Deployments"** → tres puntitos del último → **"Redeploy"**
5. 1 minuto

**La IA ahora funciona en tu celular.**

---

## PASO 6 · Agregarla como app en el celular

**iPhone:**
1. Abrí la URL en Safari
2. Botón compartir (cuadradito con flecha) → **"Añadir a pantalla de inicio"**
3. Se crea un ícono que parece una app nativa

**Android:**
1. Abrí la URL en Chrome
2. Menú → **"Agregar a pantalla de inicio"**

---

## Opcional · Datos compartidos con el equipo

Por default cada celular guarda sus propios datos. Si querés que vos, Emilia y Cristina vean los mismos productos:

1. Vercel → tu proyecto → pestaña **"Storage"**
2. **"Create Database"** → **"KV"**
3. Nombre: `kala-expo-kv`
4. Vercel te ofrece conectarlo al proyecto → **aceptá**
5. Redeployá desde "Deployments"

Ahora los datos viven en la nube y todo el equipo los ve en tiempo real.

---

## Opcional · Tu dominio propio

Si querés `expo.kala-aromas.com.ar` en vez de `kala-expo-xxx.vercel.app`:

1. En Vercel → Settings → **Domains**
2. Agregá `expo.kala-aromas.com.ar`
3. Vercel te muestra qué CNAME agregar en el DNS (apunta a `cname.vercel-dns.com`)
4. Ese cambio lo hacés donde tenés registrado `kala-aromas.com.ar`
5. En 10-30 minutos queda con HTTPS incluido

---

## Si algo falla

- **La app abre pero la IA no responde** → verificá que `ANTHROPIC_API_KEY` esté configurada y que redesployaste DESPUÉS de agregarla
- **Error 500 en /api/ai** → API key vacía o mal escrita
- **"Failed to fetch"** → sin saldo de Anthropic, andá a "Plans & Billing"
- Cualquier otra cosa, pegame el error y lo resolvemos

---

¡Éxito! Cuando termines cada paso mandame mensaje y te confirmo antes de avanzar al siguiente.
