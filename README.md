# BlogDPC · 5G en 20 000 artículos (Grupo 2)

Blog de divulgación pública de la ciencia del **Reto ABET SO7 – Comunicaciones II (27145), UIS 2026-II**.
Integrantes: Stiven Muñoz (2224110), Minuk Lee (220408), Elkin Largo (182334). Profesor: Ronald Zamora Musa.

Sitio estático (HTML, CSS y JavaScript, sin build). Chart.js y D3 se incluyen en `assets/vendor/`.

## Correr en local
```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Estructura
- `index.html`: todas las secciones del blog.
- `assets/js/data.js`: datos reales derivados de VOSviewer y del simulador (generado con `build/build_data.py`).
- `assets/js/app.js`: interacción (mapa conceptual, gráficas, simulador, quiz, chatbot, buscador, glosario, lectura en voz alta).
- `assets/img/`: mapas y figuras optimizados en WebP.

## Configuración pendiente
- **Comentarios (Giscus):** completar `GISCUS` en `assets/js/app.js` con el repositorio, `repoId` y `categoryId` de https://giscus.app.
- **Video:** poner el ID de YouTube en `data-youtube` de `#video-box` en `index.html`.
- **Analítica:** activar Web Analytics en el panel de Vercel del proyecto.

No se publica el CSV completo de Scopus (licencia); solo tablas derivadas.
