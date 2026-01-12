# 🎵 SoundWave - Premium Music Experience

**SoundWave** es una aplicación web de gestión y reproducción de música ultra-moderna, diseñada para ofrecer una experiencia premium similar a las plataformas líderes, pero con control total sobre tu propia colección local.

Construida con **React 19** y **Vite**, SoundWave combina una estética visual impactante con ingeniería de alto rendimiento y herramientas inteligentes de mejora de metadatos.

---

## ✨ Características Principales

### 📦 Gestión de Biblioteca Avanzada
- **Persistencia con IndexedDB**: Tu biblioteca se guarda localmente en el navegador. No pierdes nada al cerrar la pestaña.
- **Importación Inteligente**: Soporte para arrastrar y soltar carpetas completas o archivos `.zip`.
- **Extracción de Metadatos**: Análisis automático de archivos (MP3, WAV, OGG) para extraer artista, álbum y portadas originales usando `music-metadata`.

### 🪄 Mejora Mágica (AI Enrichment)
- **YouTube Magic Fix**: Encuentra automáticamente portadas en alta resolución y metadatos oficiales vinculando tus archivos con YouTube (vía NoEmbed e Invidious).
- **iTunes Search integration**: ¿YouTube no es suficiente? Usa el buscador de iTunes para obtener metadatos y arte de disco oficiales de Apple Music con un solo clic.
- **Editor de Metadatos**: Control total para corregir nombres, artistas y álbumes manualmente.

### 🎧 Reproductor de Alto Rendimiento
- **Control de Volumen Inteligente**: Persistencia de volumen entre sesiones y sincronización automática para evitar saltos bruscos al cambiar de canción.
- **Gestión Eficiente de Memoria**: Sistema de carga perezosa (Lazy Loading) de audio y limpieza automática de recursos (Blob revoking) para prevenir fugas de memoria.
- **Controles Premium**: Loop, reproducción aleatoria (shuffle) y navegación fluida entre pistas.

### 🎨 UI/UX de Próxima Generación
- **Estética Glassmorphism**: Una interfaz vibrante con efectos de desenfocados (blur) y transparencias elegantes.
- **Optimización GPU**: Estilos refinados para mantener una alta tasa de refresco incluso con bibliotecas extensas.
- **Componentes Memoizados**: Grid de biblioteca ultra-rápido gracias al uso de `React.memo` en tarjetas de canciones.

---

## 🚀 Stack Tecnológico

SoundWave utiliza las últimas tecnologías en el ecosistema Frontend:

- **Core**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Almacenamiento Local**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) para una base de datos robusta en el cliente.
- **Procesamiento de Archivos**: [music-metadata](https://github.com/borewit/music-metadata) y [JSZip](https://stuk.github.io/.jszip/).
- **APIs de Metadatos**: [NoEmbed](https://noembed.com/), [Invidious API](https://invidious.io/) y [iTunes Search API](https://performance.apple.com/itunes/).
- **Estilos**: CSS Modules con un sistema de diseño basado en variables y estética fluida.

---

## 🛠️ Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/soundwave.git
   cd soundwave
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. Abre `http://localhost:5173` en tu navegador.

---

## 🎓 Agradecimientos

Este proyecto es el resultado de un constante proceso de aprendizaje y perfeccionamiento en el desarrollo frontend moderno.

> 💡 **Referencia**: Este proyecto está siendo construido con el conocimiento que adquirí de React con el Bootcamp hecho por **MiduDev** más sin embargo no se asemeja en nada a su proyecto.
> Puedes visitar su sitio web en: [www.jscamp.dev](https://www.jscamp.dev)

---

## ⚠️ Disclaimer / Aviso Legal

Este proyecto ha sido desarrollado exclusivamente con **fines educativos y para el aprendizaje personal** del desarrollo frontend moderno.

- **Uso No Comercial**: SoundWave es un proyecto de código abierto sin fines de lucro.
- **Metadatos y APIs**: La aplicación utiliza servicios externos (como iTunes y diversas instancias de Invidious/YouTube) para demostrar la integración de APIs y el manejo de datos asíncronos. El uso de estos datos es meramente ilustrativo y se rige por las políticas de uso público de cada plataforma.
- **Propiedad Intelectual**: Todas las marcas comerciales, nombres de artistas y artes de disco son propiedad de sus respectivos dueños.

---
*Desarrollado con ❤️ para los amantes de la música.*
