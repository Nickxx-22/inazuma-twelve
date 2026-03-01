# ⚡ Inazuma Twelve — React + Vite

Base de datos de Inazuma Eleven. Proyecto React con Vite, preparado para conectar tu propia API.

## 🚀 Instalación

```bash
npm install
npm run dev
```

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── common/               # Reutilizables genéricos
│   │   ├── FilterSelect.jsx  # Select de filtros
│   │   ├── EmptyState.jsx    # Estado vacío
│   │   └── SectionHeader.jsx # Cabecera de sección con enlace
│   ├── players/              # Componentes específicos de jugadores
│   │   ├── CharacterCard.jsx       # Tarjeta grid
│   │   └── CharacterListItem.jsx   # Fila en vista lista
│   └── layout/               # Estructura de la app
│       ├── Layout.jsx         # Shell con Outlet
│       ├── Header.jsx
│       └── Footer.jsx
│
├── pages/                    # Una página por ruta
│   ├── HomePage.jsx
│   ├── PersonajesPage.jsx
│   ├── PersonajeDetailPage.jsx
│   ├── TecnicasPage.jsx
│   ├── EquiposPage.jsx
│   ├── MiEquipoPage.jsx
│   ├── LoginPage.jsx
│   └── RegistroPage.jsx
│
├── hooks/
│   ├── useAuth.js     # Lee el usuario del localStorage
│   └── useMyTeam.js   # Gestión del equipo (slots, save, clear)
│
├── data/
│   └── constants.js   # Opciones de filtros (elementos, posiciones...)
│
├── utils/
│   └── colors.js      # getElementColor, getNatureColor
│
├── services/
│   ├── authService.js  # login, logout, register (demo con localStorage)
│   └── teamStorage.js  # saveTeam, loadTeam, clearTeam
│
├── App.jsx             # Rutas con React Router
├── main.jsx
└── index.css           # Variables CSS globales + clases de utilidad
```

## 🔌 Conectar tu API

Cada página tiene un comentario `// TODO:` indicando exactamente dónde conectar los datos. Por ejemplo en `PersonajesPage.jsx`:

```js
// TODO: Reemplaza con tu hook/fetch de personajes
// Ejemplo: const { data: characters = [], isLoading } = useCharacters()
const characters = []  // <- aquí irán los personajes de la API
```

El patrón recomendado es crear un custom hook en `hooks/` por cada recurso:

```js
// hooks/useCharacters.js
export function useCharacters() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('https://tu-api.com/personajes')
      .then(r => r.json())
      .then(setData)
  }, [])
  return { data }
}
```

## 🎨 Tema

El tema está definido con variables CSS en `src/index.css`. Los colores principales son:

| Variable          | Valor      | Uso                    |
|-------------------|------------|------------------------|
| `--primary`       | `#3d7eff`  | Azul principal         |
| `--neon-orange`   | `#ff6b35`  | Técnicas, acciones     |
| `--neon-green`    | `#36d399`  | Equipos, éxito         |
| `--neon-pink`     | `#f471b5`  | Mi equipo, favoritos   |
| `--card`          | `#111420`  | Fondo de tarjetas      |
| `--border`        | `#1e2440`  | Bordes                 |

## 🔐 Auth demo

- Cualquier email + contraseña → usuario normal
- `admin@inazuma.com` / `admin` → usuario admin

En producción, reemplaza `src/services/authService.js` con llamadas a tu backend.
