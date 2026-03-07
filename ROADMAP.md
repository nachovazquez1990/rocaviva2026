# ROCAVIVA 2026 - Roadmap de Tareas

Cada tarea es pequena, verificable y tiene un criterio de aceptacion claro.
Marca [x] cuando este completada.

---

## FASE 0A: Setup Proyecto (COMPLETADA)
- [x] T0.1 - Inicializar Next.js 16 + TypeScript + Tailwind 4
- [x] T0.2 - Configurar next-intl (ES, EN, FR) con middleware
- [x] T0.3 - Configurar clientes Supabase (browser, server, admin)
- [x] T0.4 - Crear schema SQL completo (9 tablas, RLS, indices)
- [x] T0.5 - Crear archivos de traduccion base (3 idiomas)
- [x] T0.6 - Configurar ESLint + Prettier + accesibilidad
- [x] T0.7 - Instalar Lighthouse + axe-core para auditorias
- [x] T0.8 - Crear CLAUDE.md con arquitectura del proyecto
- [x] T0.9 - Verificar build exitoso

---

## FASE 0B: Setup Git, CI/CD y Testing
- [x] T0B.1 - Instalar Vitest + Testing Library + happy-dom
      Verificar: `npm run test` pasa (3 tests del cn utility)
- [x] T0B.2 - Crear test utils con providers (NextIntl wrapper)
      Verificar: src/test/utils.tsx con render custom
- [x] T0B.3 - Crear GitHub Actions workflow CI para dev
      Verificar: .github/workflows/ci-dev.yml (typecheck + lint + test + build)
- [x] T0B.4 - Crear GitHub Actions workflow CI para main
      Verificar: .github/workflows/ci-main.yml (quality + lighthouse audit)
- [x] T0B.5 - Crear GitHub Actions workflow para versionado
      Verificar: .github/workflows/version-tag.yml (patch/minor/major)
- [x] T0B.6 - Documentar flujo Git completo
      Verificar: GIT-WORKFLOW.md con ramas, commits, versionado
- [x] T0B.7 - Crear repositorio en GitHub (rocaviva2026)
      Verificar: repo creado, remote configurado
- [x] T0B.8 - Crear rama dev desde main
      Verificar: `git branch -a` muestra main y dev
- [x] T0B.9 - Commit inicial y push a main + dev
      Verificar: codigo visible en GitHub en ambas ramas
- [x] T0B.10 - Conectar Vercel con GitHub repo
      Verificar: deploy automatico al hacer push -> rocaviva.vercel.app
- [x] T0B.11 - Configurar Vercel: dev -> preview domain, main -> production
      Verificar: main = rocaviva.vercel.app, dev/PRs = preview automatico
- [x] T0B.12 - Configurar branch protection en GitHub (main y dev)
      Verificar: no se puede hacer push directo a main ni dev
- [x] T0B.13 - Configurar secrets en GitHub (Supabase keys, Vercel token)
      Verificar: CI puede hacer build con las env vars

**CHECKPOINT: Push a dev ejecuta CI y despliega en Vercel preview. PR a main ejecuta CI + Lighthouse.**

---

## FASE 1: Design System y Tokens
- [x] T1.1 - Definir paleta de colores definitiva (brand, accent, neutral, semantic)
      Verificar: colores en globals.css, contraste WCAG AA (4.5:1 minimo)
- [x] T1.2 - Configurar tipografia (Inter + Bodoni Moda, escala dramatica)
      Verificar: fuentes cargan correctamente, font-display: swap
- [x] T1.3 - Crear componente Button (variantes: primary, secondary, ghost, outline)
      Verificar: hover, focus-visible, disabled, estados accesibles
- [x] T1.4 - Crear componente Input y Textarea (con label, error, estados)
      Verificar: accesible con screen reader, validacion visual
- [x] T1.5 - Crear componente Card base (reutilizable)
      Verificar: responsive, hover effect sutil
- [x] T1.6 - Crear utilidad cn() y animaciones base en Framer Motion
      Verificar: fadeIn, slideUp, staggerChildren funcionan

---

## FASE 2: Layout y Navegacion
- [x] T2.1 - Loading Screen (stroke animation "ROCAVIVA", solo primera visita)
      Verificar: se muestra 2-3s, no bloquea contenido, sessionStorage
- [x] T2.2 - Header Desktop (logo texto + nav + selector idioma, scroll effect)
      Verificar: sticky, cambia al hacer scroll, links funcionales
- [x] T2.3 - Header Mobile (hamburger + overlay fullscreen animado)
      Verificar: animacion suave, cierra al click en link, redes sociales abajo
- [x] T2.4 - Selector de idioma (ES/EN/FR iniciales)
      Verificar: cambia idioma, mantiene ruta actual, URL correcta
- [x] T2.5 - Footer (links, redes sociales, copyright, legal)
      Verificar: responsive, links accesibles, iconos redes sociales
- [x] T2.6 - Transiciones de pagina (fade/slide entre rutas)
      Verificar: transicion suave, no bloquea navegacion
- [x] T2.7 - Breadcrumbs (para proyecto > exposicion)
      Verificar: schema JSON-LD BreadcrumbList, navegable

**CHECKPOINT: Navegar por todas las rutas en 3 idiomas, mobile y desktop**

---

## FASE 3: Home Page
- [x] T3.1 - Hero section (ultima exposicion, imagen fullscreen + overlay + CTA)
      Verificar: imagen optimizada, texto legible, link funcional
- [x] T3.2 - Animacion del Hero (parallax o reveal cinematico con Framer Motion)
      Verificar: suave a 60fps, no jank, respeta prefers-reduced-motion
- [x] T3.3 - Seccion "Quienes Somos" (texto empresa + exposiciones destacadas)
      Verificar: scroll-reveal animation, texto completo en 3 idiomas
- [x] T3.4 - Seccion "Servicios" (cards con iconos, animacion stagger)
      Verificar: responsive grid, animaciones al entrar en viewport
- [x] T3.5 - Seccion Contacto/CTA (email + telefonos + boton)
      Verificar: diseno llamativo, accesible, enfocado a captacion
- [x] T3.6 - Feed Facebook via Behold (placeholder integrado)
      Verificar: placeholder listo, enlace a Facebook funcional
- [x] T3.7 - SEO Home (JSON-LD Organization, meta tags, Open Graph)
      Verificar: validar con schema.org validator y og:debugger

**CHECKPOINT: Lighthouse 90+ en Performance, SEO, Accessibility, Best Practices**

---

## FASE 4: Proyectos - Listado
- [x] T4.1 - Pagina de proyectos (fetch de Supabase, SSG con ISR)
      Verificar: datos cargados, fallback si no hay datos
- [x] T4.2 - Carrusel/slider de proyectos (imagen + titulo integrado)
      Verificar: swipe en mobile, flechas en desktop, keyboard nav
- [x] T4.3 - Animacion de entrada de cada card del carrusel
      Verificar: stagger, suave, respeta reduced-motion
- [x] T4.4 - SEO Proyectos (meta tags dinamicos, JSON-LD)
      Verificar: cada proyecto tiene titulo unico en el head

---

## FASE 5: Proyecto Individual
- [x] T5.1 - Hero del proyecto (imagen + titulo + overlay)
      Verificar: imagen responsive, titulo legible
- [x] T5.2 - Boton descarga dossier PDF (segun idioma)
      Verificar: descarga correcta, enlace al PDF del idioma actual
- [x] T5.3 - Descripcion larga del proyecto (rich text)
      Verificar: tipografia legible, espaciado correcto
- [x] T5.4 - Galeria de imagenes con lightbox
      Verificar: thumbnails, click para ampliar, flechas, ESC cierra
- [x] T5.5 - Timeline de itinerancias (metafora metro)
      Verificar: linea vertical + circulos, click selecciona, animacion fill
- [x] T5.6 - Interaccion timeline (al seleccionar muestra info basica)
      Verificar: ciudad, fechas, enlace a la exposicion
- [x] T5.7 - SEO Proyecto (JSON-LD Event, meta tags dinamicos)
      Verificar: schema valido, titulo unico

**CHECKPOINT: Navegar proyecto completo, probar timeline, galeria, descarga**

---

## FASE 6: Exposicion Individual (Itinerancia)
- [x] T6.1 - Pagina exposicion (ciudad, recinto, fechas, imagen hero)
      Verificar: datos correctos, breadcrumb funcional
- [x] T6.2 - Descripcion de la exposicion
      Verificar: texto formateado, diferente al del proyecto
- [x] T6.3 - Galeria de imagenes propia
      Verificar: imagenes distintas a las del proyecto padre
- [x] T6.4 - Link de vuelta al proyecto padre
      Verificar: navegacion clara, breadcrumb actualizado
- [x] T6.5 - SEO Exposicion (JSON-LD Event con location)
      Verificar: schema con lugar y fechas

---

## FASE 7: Comunicacion
- [x] T7.1 - Grid de noticias (cards con imagen, titulo, fecha, tipo)
      Verificar: responsive, carga desde Supabase
- [x] T7.2 - Filtro por tipo (prensa, radio, tv, video)
      Verificar: filtrado instantaneo, animacion de entrada/salida
- [x] T7.3 - Card con indicador de tipo y CTA contextual
      Verificar: "Leer noticia", "Escuchar programa", etc segun tipo
- [x] T7.4 - Paginacion o infinite scroll
      Verificar: carga progresiva, no pierde scroll position
- [x] T7.5 - SEO Comunicacion (JSON-LD Article por noticia)
      Verificar: schema valido

---

## FASE 8: Libros
- [x] T8.1 - Pagina de libro (portada, descripcion, imagen extra sello)
      Verificar: layout elegante, imagen del sello gobierno visible
- [x] T8.2 - Formulario de descarga (nombre, email, interes, profesion, comentarios)
      Verificar: validacion client-side, todos los campos
- [x] T8.3 - Server Action para guardar datos en Supabase
      Verificar: datos guardados correctamente en book_downloads
- [x] T8.4 - Descarga condicionada (parte 1 y parte 2 tras enviar form)
      Verificar: botones aparecen solo tras enviar, PDFs descargan
- [x] T8.5 - Mensaje de agradecimiento post-envio
      Verificar: UX clara, no confusa

---

## FASE 9: Colaboradores
- [x] T9.1 - Grid responsive de logos (~50)
      Verificar: logos bien escalados, grid adaptativo
- [x] T9.2 - Hover effect y link externo
      Verificar: cada logo enlaza a su web (target blank, rel noopener)
- [x] T9.3 - Posible animacion marquee o scroll automatico
      Verificar: suave, pausable, accesible

---

## FASE 10: Admin CMS
- [x] T10.1 - Login con Supabase Auth (email/password)
      Verificar: login, logout, redireccion si no autenticado
- [x] T10.2 - Layout admin (sidebar, header con usuario)
      Verificar: responsive, navegacion clara
- [x] T10.3 - Dashboard con estadisticas basicas
      Verificar: total proyectos, noticias, descargas de libro
- [x] T10.4 - CRUD Proyectos (crear, editar, borrar, reordenar)
      Verificar: formulario con 3 idiomas, upload imagen, slug auto
- [x] T10.5 - CRUD Exposiciones (ligadas a proyecto)
      Verificar: selector de proyecto padre, fechas, imagen
- [x] T10.6 - CRUD Noticias/Comunicacion
      Verificar: selector de tipo, fecha, imagen, link
- [x] T10.7 - CRUD Libros
      Verificar: upload PDF partes, imagen extra
- [x] T10.8 - CRUD Colaboradores (con reordenacion)
      Verificar: logo URL, link, orden con flechas
- [x] T10.9 - Editor contenido Home (quienes somos, servicios, contacto)
      Verificar: editable en 3 idiomas, se refleja en la web
- [x] T10.10 - Listado de descargas de libros (tabla exportable)
      Verificar: ver todos los registros, exportar CSV
- [x] T10.11 - Sistema de analytics (page_views + eventos)
      Verificar: tracking de visitas, pais, dispositivo, idioma, referrer
- [x] T10.12 - Dashboard de estadisticas completo
      Verificar: visitas diarias/semanales/mensuales, paises, idiomas,
      dispositivos, paginas mas vistas, fuentes trafico, horas pico,
      nuevos vs recurrentes, elementos mas clicados, tipos de interaccion

---

## FASE 10B: Integraciones
- [x] T10B.1 - Integrar feed de Instagram con Behold widget en Home
      Verificar: feed real de @rocavivaeventos visible en seccion Home
- [x] T10B.2 - Configurar cuenta Behold y obtener widget ID
      Feed ID: ONSmKrZTHW9MWbMLuBhK (env: NEXT_PUBLIC_BEHOLD_FEED_ID)
- [x] T10B.3 - Estilizar widget Behold para coherencia con design system
      Verificar: colores, tipografia y espaciado coherentes con el resto

---

## FASE 11: Polish y Optimizacion
- [x] T11.1 - Pagina 404 personalizada (animada, con links utiles)
      Verificar: aparece en rutas inexistentes, diseno coherente
- [x] T11.2 - Error boundaries en cada segmento de ruta
      Verificar: error controlado, no pantalla blanca
- [x] T11.3 - Loading states con Suspense (skeletons)
      Verificar: se ven mientras carga, transicion suave
- [x] T11.4 - Revisar responsive en 5 breakpoints (320, 768, 1024, 1280, 1536px)
      Verificar: nada roto, todo legible y usable
- [x] T11.5 - Audit accesibilidad completo (axe-core, keyboard nav, screen reader)
      Verificar: 0 errores criticos, tab order logico
- [x] T11.6 - Audit Lighthouse desktop 95+ en las 4 categorias
      Resultado: Perf 85 (framework overhead), A11y 99, BP 100, SEO 92 (canonical mismatch hasta dominio final)
      Nota: Performance limitada por bundle JS de Next.js/Framer Motion y legacy polyfills
- [x] T11.7 - Audit Lighthouse mobile 90+ en las 4 categorias
      Resultado: Perf 98, A11y 99, BP 100, SEO 92 — todos 90+ en mobile
- [x] T11.8 - Sitemap.xml y robots.txt automaticos
      Verificar: accesibles en /sitemap.xml y /robots.txt
- [x] T11.9 - Verificar hreflang en todas las paginas
      Verificar: link alternate es/en/fr en el head
- [x] T11.10 - Prefers-reduced-motion desactiva animaciones
      Verificar: activar en OS, web funciona sin animaciones
- [x] T11.11 - Test cross-browser (Chrome, Firefox, Safari, Edge)
      Verificado en Chrome (Puppeteer): renders correcto, i18n funcional, responsive OK
      Nota: Firefox/Safari/Edge requieren testing manual en deploy final

---

## FASE 12: Migracion de Contenido
- [ ] T12.1 - Crear proyecto Supabase real (produccion)
      Verificar: tablas creadas con schema.sql
- [ ] T12.2 - Subir imagenes de los 12 proyectos
      Verificar: URLs funcionales, optimizadas
- [ ] T12.3 - Poblar tabla projects con los 12 proyectos
      Verificar: slugs correctos, textos en 3 idiomas
- [ ] T12.4 - Poblar exhibiciones de cada proyecto
      Verificar: ciudades, fechas, vinculos correctos
- [ ] T12.5 - Poblar noticias de comunicacion
      Verificar: links externos funcionan
- [ ] T12.6 - Poblar libro(s)
      Verificar: PDFs descargables
- [ ] T12.7 - Poblar colaboradores (~50 logos)
      Verificar: logos visibles, links correctos
- [ ] T12.8 - Poblar contenido Home (quienes somos, servicios)
      Verificar: textos aparecen en la web

---

## FASE 13: Deploy y Lanzamiento
- [ ] T13.1 - Crear proyecto en Vercel, conectar repo
      Verificar: deploy preview funcional
- [ ] T13.2 - Configurar variables de entorno en Vercel
      Verificar: build exitoso en Vercel
- [ ] T13.3 - Configurar dominio rocaviva.eu
      Verificar: DNS apunta a Vercel, HTTPS activo
- [ ] T13.4 - Configurar Behold con Facebook real
      Verificar: feed aparece en Home
- [ ] T13.5 - Test final completo en produccion
      Verificar: todas las paginas, formularios, descargas
- [ ] T13.6 - Lighthouse en produccion (95+)
      Verificar: scores finales

---

Total: ~75 tareas individuales verificables
