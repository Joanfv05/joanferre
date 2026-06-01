# Joan Ferrer — Portfolio

Portfolio personal de editor de vídeo y desarrollador.
Desplegado en GitHub Pages: `https://joanferreyt.github.io`

---

## Estructura del proyecto

```
portfolio/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos — diseño cinematográfico oscuro
├── js/
│   └── main.js         # Interacciones: modal reel, filtros, reveal
├── assets/             # Imágenes, thumbnails, foto de perfil
│   └── (vacío — añade tus archivos aquí)
└── README.md
```

---

## Configuración inicial — GitHub Pages

### 1. Crear el repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repositorio: **`joanferreyt.github.io`**
   - Debe ser exactamente `<tu-usuario>.github.io`
3. Público ✓ (necesario para GitHub Pages gratuito)
4. **Sin** inicializar con README (ya tienes el tuyo)
5. Clic en **Create repository**

### 2. Conectar y subir el código

```bash
# Dentro de la carpeta del portfolio:
git remote add origin https://github.com/joanferreyt/joanferreyt.github.io.git
git push -u origin main
```

### 3. Activar GitHub Pages

1. Ve a tu repositorio → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `/ (root)`
4. Clic en **Save**

En 1–2 minutos estará en vivo en `https://joanferreyt.github.io`

---

## Personalización

### Añadir tu reel de YouTube/Vimeo

En `index.html`, busca el `<iframe id="reelIframe">` y cambia el `data-src`:

```html
<!-- YouTube -->
data-src="https://www.youtube.com/embed/TU_VIDEO_ID?autoplay=1&rel=0"

<!-- Vimeo -->
data-src="https://player.vimeo.com/video/TU_VIDEO_ID?autoplay=1"
```

### Añadir tu foto

Coloca tu foto en `assets/foto.jpg` y en `index.html` reemplaza el bloque `.about-photo-placeholder` por:

```html
<img src="assets/foto.jpg" alt="Joan Ferrer" class="about-photo">
```

Y añade al CSS:
```css
.about-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  border-radius: 2px;
}
```

### Añadir thumbnails de vídeo

Coloca los JPG en `assets/` y añade el `<img>` dentro de cada `.vcard-thumb`:

```html
<img src="assets/thumb-mi-video.jpg" alt="Descripción del vídeo" loading="lazy">
```

### Cambiar email y links

Busca y reemplaza en `index.html`:
- `tu@email.com` → tu email real
- `joanferreyt` → tu usuario real de GitHub/YouTube/TikTok

---

## Workflow de Git — commits organizados

```bash
# Commit inicial (ya hecho)
git commit -m "feat: estructura base del portfolio"

# Después de añadir tu reel:
git commit -m "feat(hero): añadir link al showreel"

# Después de añadir thumbnails:
git commit -m "feat(video): thumbnails para proyectos de vídeo"

# Después de personalizar textos:
git commit -m "content: textos y links personalizados"

# Subir cambios:
git push
```

Los cambios en GitHub Pages se despliegan automáticamente tras cada push (1–2 min).

---

## Tecnologías

- HTML5 semántico
- CSS puro con custom properties (sin framework)
- Vanilla JS (sin dependencias)
- Google Fonts: Playfair Display + DM Sans + DM Mono
- GitHub Pages para el despliegue

---

Hecho con código, tijeras de edición y demasiado café.
