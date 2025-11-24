# Rotaract D4465 - Plataforma Distrital de Voluntariado

Plataforma web para la gestión de clubes, convocatorias y proyectos de voluntariado del Distrito 4465 de Rotaract en Perú.

## 🚀 Tecnologías

- **React 19** - Biblioteca de JavaScript para interfaces de usuario
- **Vite** - Build tool y dev server ultrarrápido
- **TailwindCSS** - Framework de CSS utilitario
- **Flowbite** - Componentes UI basados en Tailwind

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn

## 🛠️ Instalación

1. Clona el repositorio o descarga el proyecto

2. Instala las dependencias:
```bash
npm install
```

## 🏃 Ejecución en Desarrollo

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Construcción para Producción

Genera la versión optimizada para producción:

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 📁 Estructura del Proyecto

```
rotaract-d4465-frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/          # Imágenes, iconos, logos
│   ├── components/      # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   ├── HeroSection.jsx
│   │   ├── MetricsSection.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── ClubsGrid.jsx
│   │   ├── CTASection.jsx
│   │   └── Footer.jsx
│   ├── pages/           # Páginas principales
│   │   └── LandingPage.jsx
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🌐 API Endpoints

La aplicación consume los siguientes endpoints del backend:

- **Clubes**: `GET https://rotaractd4465api.up.railway.app/api/v1/clubes`
- **Convocatorias**: `GET https://rotaractd4465api.up.railway.app/api/v1/convocatorias`
- **Proyectos**: `GET https://rotaractd4465api.up.railway.app/api/v1/proyectos`

## 🎨 Características del Landing Page

### Secciones Principales

1. **Navbar** - Navegación responsive con enlaces y botones de autenticación
2. **Hero Section** - Título principal y llamado a la acción
3. **Metrics Section** - Métricas dinámicas desde la API (clubes, convocatorias, proyectos)
4. **How It Works** - Proceso de 3 pasos para usar la plataforma
5. **Clubs Grid** - Muestra de clubes del distrito
6. **CTA Section** - Llamado final a la acción
7. **Footer** - Información de copyright y enlaces

### Características Técnicas

- ✅ **Diseño Responsive** - Optimizado para móvil, tablet y desktop
- ✅ **Accesibilidad WCAG** - Estados de foco, ARIA labels, buen contraste
- ✅ **Integración API Real** - Datos dinámicos desde el backend
- ✅ **Loading States** - Spinners y manejo de estados de carga
- ✅ **Error Handling** - Manejo robusto de errores de API
- ✅ **Componentes Modulares** - Código organizado y reutilizable
- ✅ **Branding Consistente** - Colores institucionales de Rotaract D4465

## 🎨 Colores del Branding

El proyecto utiliza los colores institucionales de Rotaract D4465:

- **Primary Color**: `#C00030` (Rojo Rotaract)
- Variaciones definidas en `tailwind.config.js`

## 📝 Notas de Desarrollo

- El proyecto usa **JavaScript** (no TypeScript) para simplificar el desarrollo
- Los componentes están comentados para facilitar el mantenimiento
- Se siguen las mejores prácticas de React y accesibilidad web
- El diseño es modular y fácil de extender

## 📄 Licencia

© 2025 Rotaract Distrito 4465 – Todos los derechos reservados
