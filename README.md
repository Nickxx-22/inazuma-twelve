# ⚡ Inazuma Twelve — React + Vite

Base de datos de Inazuma Eleven. Proyecto fan no oficial construido con React + Vite, conectado a una API REST propia desplegada en Render.

🌐 **Demo en vivo:** https://nickxx-22.github.io/inazuma-twelve/  
🔌 **API:** https://api-inazuma.onrender.com

---

## 🛠️ Requisitos Previos

| Herramienta | Versión mínima | Descarga |
|-------------|----------------|----------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ | Incluido con Node.js |
| Git | cualquiera | https://git-scm.com |

---

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Nickxx-22/inazuma-twelve.git
cd inazuma-twelve

# 2. Instalar dependencias
npm install

# 3. Arrancar en desarrollo
npm run dev
```

La app estará disponible en **http://localhost:5173**

```bash
# Build para producción
npm run build

# Probar el build localmente
npm run preview
```

---

## 📦 Dependencias Principales

| Paquete | Versión | Uso |
|---------|---------|-----|
| `react` | ^18 | Framework UI principal |
| `react-dom` | ^18 | Renderizado en el DOM |
| `react-router-dom` | ^6 | Enrutamiento SPA |
| `vite` | ^5 | Bundler y servidor de desarrollo |
| `chart.js` | ^4 | Gráfico radar de estadísticas |
| `react-chartjs-2` | ^5 | Wrapper React para Chart.js |
| `lucide-react` | latest | Iconos SVG |
| `vite-plugin-pwa` | latest | PWA (Progressive Web App) |

---

## 🔧 Configuración

La URL de la API y el helper de imágenes están centralizados en `src/config.js`:

```js
export const BASE_URL = 'https://api-inazuma.onrender.com'
export const imgUrl = (path) => path ? `${BASE_URL}${path}` : ''
```

Para cambiar la API en local, modifica `BASE_URL` directamente en ese archivo.

---

## 📁 Estructura del Proyecto

```
inazuma-twelve/
│
├── public/
│   ├── fonts/
│   │   └── Bangers-Regular.ttf     # Fuente de títulos
│   └── icons/                      # Iconos PWA para instalación
│
└── src/
    ├── config.js                   # BASE_URL + helper imgUrl()
    ├── index.css                   # Variables CSS globales, gradientes, tema oscuro
    ├── App.jsx                     # Rutas con React Router + guards de admin
    ├── main.jsx                    # Punto de entrada de la app
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Layout.jsx          # Shell con Outlet
    │   │   ├── Header.jsx          # Navegación principal sticky
    │   │   └── Footer.jsx          # Pie de página con redes
    │   ├── players/
    │   │   ├── CharacterCard.jsx        # Tarjeta en vista grid
    │   │   └── CharacterListItem.jsx    # Fila en vista lista con stats
    │   └── common/
    │       ├── FilterSelect.jsx    # Select de filtros reutilizable
    │       ├── EmptyState.jsx      # Estado vacío
    │       └── SectionHeader.jsx   # Cabecera de sección con enlace
    │
    ├── pages/
    │   ├── HomePage.jsx            # Inicio con carruseles de equipos y técnicas
    │   ├── PersonajesPage.jsx      # Listado de jugadores con filtros y vista lista/grid
    │   ├── PersonajeDetailPage.jsx # Detalle de jugador: radar, stats, técnicas, equipos
    │   ├── TecnicasPage.jsx        # Catálogo de técnicas con modal de video
    │   ├── EquiposPage.jsx         # Listado de equipos con tarjetas
    │   ├── MiEquipoPage.jsx        # Constructor de equipo con campo visual interactivo
    │   ├── AdminPage.jsx           # Panel de administración de usuarios (solo admin)
    │   ├── LoginPage.jsx           # Login de usuario
    │   └── RegistroPage.jsx        # Registro de usuario
    │
    ├── hooks/
    │   ├── useAuth.js              # Lee el usuario del localStorage
    │   └── useMyTeam.js            # Gestión del equipo (slots, save, clear)
    │
    ├── services/
    │   ├── authService.js          # login, logout, register contra la API
    │   └── teamStorage.js          # saveTeam, loadTeam, clearTeam
    │
    └── utils/
        └── colors.js               # getElementColor, getNatureColor
```

---

## 🎨 Tema

Variables CSS globales definidas en `src/index.css`:

| Variable | Valor | Uso |
|----------|-------|-----|
| `--bg` | `#0b1020` | Fondo principal |
| `--primary` | `#3d7eff` | Azul principal |
| `--neon-orange` | `#ff6b35` | Técnicas, acciones |
| `--neon-green` | `#36d399` | Equipos, éxito |
| `--neon-pink` | `#f471b5` | Mi equipo, favoritos |
| `--neon-yellow` | `#f5c518` | Tier, highlights |
| `--card` | `rgba(255,255,255,0.045)` | Fondo de tarjetas |
| `--border` | `rgba(255,255,255,0.13)` | Bordes |
| `--font-display` | `'Bangers'` | Fuente de títulos (h1, h2) |

---

## 🚀 Despliegue (GitHub Pages)

```bash
# Asegúrate de tener la base correcta en vite.config.js
# base: '/inazuma-twelve/'

npm run build
npx gh-pages -d dist
```

URL de producción: https://nickxx-22.github.io/inazuma-twelve/

---

## 🔐 Credenciales de Prueba

| Usuario | Contraseña | Rol | Acceso |
|---------|-----------|-----|--------|
| `Nico` | `20052722` | admin | Panel admin completo |
| cualquier registro | — | user | Favoritos + Mi Equipo |

---

## 📝 Notas

- El backend está en **Render** con plan gratuito — puede tardar ~30s en arrancar si lleva tiempo inactivo.
- Las imágenes se sirven desde la misma API usando el helper `imgUrl()`.
- La app es **PWA** — se puede instalar en móvil desde el navegador.
- Proyecto fan no oficial. Inazuma Eleven es propiedad de Level-5.