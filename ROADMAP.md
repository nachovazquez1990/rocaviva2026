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
- [ ] T1.1 - Definir paleta de colores definitiva (brand, accent, neutral, semantic)
      Verificar: colores en globals.css, contraste WCAG AA (4.5:1 minimo)
- [ ] T1.2 - Configurar tipografia (Inter + Playfair Display, escala de tamanos)
      Verificar: fuentes cargan correctamente, font-display: swap
- [ ] T1.3 - Crear componente Button (variantes: primary, secondary, ghost, outline)
      Verificar: hover, focus-visible, disabled, estados accesibles
- [ ] T1.4 - Crear componente Input y Textarea (con label, error, estados)
      Verificar: accesible con screen reader, validacion visual
- [ ] T1.5 - Crear componente Card base (reutilizable)
      Verificar: responsive, hover effect sutil
- [ ] T1.6 - Crear utilidad cn() y animaciones base en Framer Motion
      Verificar: fadeIn, slideUp, staggerChildren funcionan

---

## FASE 2: Layout y Navegacion
- [ ] T2.1 - Loading Screen (animacion logo Rocaviva, solo primera visita)
      Verificar: se muestra 2-3s, no bloquea contenido, sessionStorage
- [ ] T2.2 - Header Desktop (logo + nav + selector idioma, scroll effect)
      Verificar: sticky, cambia al hacer scroll, links funcionales
- [ ] T2.3 - Header Mobile (hamburger + overlay fullscreen animado)
      Verificar: animacion suave, cierra al click en link, focus trap
- [ ] T2.4 - Selector de idioma (ES/EN/FR con banderas o iniciales)
      Verificar: cambia idioma, mantiene ruta actual, URL correcta
- [ ] T2.5 - Footer (links, redes sociales, copyright, legal)
      Verificar: responsive, links accesibles, iconos redes sociales
- [ ] T2.6 - Transiciones de pagina (fade/slide entre rutas)
      Verificar: transicion suave, no bloquea navegacion
- [ ] T2.7 - Breadcrumbs (para proyecto > exposicion)
      Verificar: schema JSON-LD BreadcrumbList, navegable

**CHECKPOINT: Navegar por todas las rutas en 3 idiomas, mobile y desktop**

---

## FASE 3: Home Page
- [ ] T3.1 - Hero section (ultima exposicion, imagen fullscreen + overlay + CTA)
      Verificar: imagen optimizada, texto legible, link funcional
- [ ] T3.2 - Animacion del Hero (parallax o reveal cinematico con GSAP)
      Verificar: suave a 60fps, no jank, respeta prefers-reduced-motion
- [ ] T3.3 - Seccion "Quienes Somos" (texto editable + imagen)
      Verificar: scroll-reveal animation, contenido desde Supabase
- [ ] T3.4 - Seccion "Servicios" (cards con iconos, animacion stagger)
      Verificar: responsive grid, animaciones al entrar en viewport
- [ ] T3.5 - Seccion Contacto/CTA (formulario o enlace destacado)
      Verificar: diseno llamativo, accesible, enfocado a captacion
- [ ] T3.6 - Feed Facebook via Behold (widget integrado)
      Verificar: carga asincrona, no bloquea render, responsive
- [ ] T3.7 - SEO Home (JSON-LD Organization, meta tags, Open Graph)
      Verificar: validar con schema.org validator y og:debugger

**CHECKPOINT: Lighthouse 90+ en Performance, SEO, Accessibility, Best Practices**

---

## FASE 4: Proyectos - Listado
- [ ] T4.1 - Pagina de proyectos (fetch de Supabase, SSG con ISR)
      Verificar: datos cargados, fallback si no hay datos
- [ ] T4.2 - Carrusel/slider de proyectos (imagen + titulo integrado)
      Verificar: swipe en mobile, flechas en desktop, keyboard nav
- [ ] T4.3 - Animacion de entrada de cada card del carrusel
      Verificar: stagger, suave, respeta reduced-motion
- [ ] T4.4 - SEO Proyectos (meta tags dinamicos, JSON-LD)
      Verificar: cada proyecto tiene titulo unico en el head

---

## FASE 5: Proyecto Individual
- [ ] T5.1 - Hero del proyecto (imagen + titulo + overlay)
      Verificar: imagen responsive, titulo legible
- [ ] T5.2 - Boton descarga dossier PDF (segun idioma)
      Verificar: descarga correcta, enlace al PDF del idioma actual
- [ ] T5.3 - Descripcion larga del proyecto (rich text)
      Verificar: tipografia legible, espaciado correcto
- [ ] T5.4 - Galeria de imagenes con lightbox
      Verificar: thumbnails, click para ampliar, flechas, ESC cierra
- [ ] T5.5 - Timeline de itinerancias (metafora metro)
      Verificar: linea vertical + circulos, click selecciona, animacion fill
- [ ] T5.6 - Interaccion timeline (al seleccionar muestra info basica)
      Verificar: ciudad, fechas, enlace a la exposicion
- [ ] T5.7 - SEO Proyecto (JSON-LD Event, meta tags dinamicos)
      Verificar: schema valido, titulo unico

**CHECKPOINT: Navegar proyecto completo, probar timeline, galeria, descarga**

---

## FASE 6: Exposicion Individual (Itinerancia)
- [ ] T6.1 - Pagina exposicion (ciudad, recinto, fechas, imagen hero)
      Verificar: datos correctos, breadcrumb funcional
- [ ] T6.2 - Descripcion de la exposicion
      Verificar: texto formateado, diferente al del proyecto
- [ ] T6.3 - Galeria de imagenes propia
      Verificar: imagenes distintas a las del proyecto padre
- [ ] T6.4 - Link de vuelta al proyecto padre
      Verificar: navegacion clara, breadcrumb actualizado
- [ ] T6.5 - SEO Exposicion (JSON-LD Event con location)
      Verificar: schema con lugar y fechas

---

## FASE 7: Comunicacion
- [ ] T7.1 - Grid de noticias (cards con imagen, titulo, fecha, tipo)
      Verificar: responsive, carga desde Supabase
- [ ] T7.2 - Filtro por tipo (prensa, radio, tv, video)
      Verificar: filtrado instantaneo, animacion de entrada/salida
- [ ] T7.3 - Card con indicador de tipo y CTA contextual
      Verificar: "Leer noticia", "Escuchar programa", etc segun tipo
- [ ] T7.4 - Paginacion o infinite scroll
      Verificar: carga progresiva, no pierde scroll position
- [ ] T7.5 - SEO Comunicacion (JSON-LD Article por noticia)
      Verificar: schema valido

---

## FASE 8: Libros
- [ ] T8.1 - Pagina de libro (portada, descripcion, imagen extra sello)
      Verificar: layout elegante, imagen del sello gobierno visible
- [ ] T8.2 - Formulario de descarga (nombre, email, interes, profesion, comentarios)
      Verificar: validacion client-side, todos los campos
- [ ] T8.3 - Server Action para guardar datos en Supabase
      Verificar: datos guardados correctamente en book_downloads
- [ ] T8.4 - Descarga condicionada (parte 1 y parte 2 tras enviar form)
      Verificar: botones aparecen solo tras enviar, PDFs descargan
- [ ] T8.5 - Mensaje de agradecimiento post-envio
      Verificar: UX clara, no confusa

---

## FASE 9: Colaboradores
- [ ] T9.1 - Grid responsive de logos (~50)
      Verificar: logos bien escalados, grid adaptativo
- [ ] T9.2 - Hover effect y link externo
      Verificar: cada logo enlaza a su web (target blank, rel noopener)
- [ ] T9.3 - Posible animacion marquee o scroll automatico
      Verificar: suave, pausable, accesible

---

## FASE 10: Admin CMS
- [ ] T10.1 - Login con Supabase Auth (email/password)
      Verificar: login, logout, redireccion si no autenticado
- [ ] T10.2 - Layout admin (sidebar, header con usuario)
      Verificar: responsive, navegacion clara
- [ ] T10.3 - Dashboard con estadisticas basicas
      Verificar: total proyectos, noticias, descargas de libro
- [ ] T10.4 - CRUD Proyectos (crear, editar, borrar, reordenar)
      Verificar: formulario con 3 idiomas, upload imagen, slug auto
- [ ] T10.5 - CRUD Exposiciones (ligadas a proyecto)
      Verificar: selector de proyecto padre, fechas, imagen
- [ ] T10.6 - CRUD Noticias/Comunicacion
      Verificar: selector de tipo, fecha, imagen, link
- [ ] T10.7 - CRUD Libros
      Verificar: upload PDF partes, imagen extra
- [ ] T10.8 - CRUD Colaboradores (con reordenacion drag & drop)
      Verificar: upload logo, link, orden
- [ ] T10.9 - Editor contenido Home (quienes somos, servicios, contacto)
      Verificar: editable en 3 idiomas, se refleja en la web
- [ ] T10.10 - Listado de descargas de libros (tabla exportable)
      Verificar: ver todos los registros, exportar CSV

---

## FASE 11: Polish y Optimizacion
- [ ] T11.1 - Pagina 404 personalizada (animada, con links utiles)
      Verificar: aparece en rutas inexistentes, diseno coherente
- [ ] T11.2 - Error boundaries en cada segmento de ruta
      Verificar: error controlado, no pantalla blanca
- [ ] T11.3 - Loading states con Suspense (skeletons)
      Verificar: se ven mientras carga, transicion suave
- [ ] T11.4 - Revisar responsive en 5 breakpoints (320, 768, 1024, 1280, 1536px)
      Verificar: nada roto, todo legible y usable
- [ ] T11.5 - Audit accesibilidad completo (axe-core, keyboard nav, screen reader)
      Verificar: 0 errores criticos, tab order logico
- [ ] T11.6 - Audit Lighthouse desktop 95+ en las 4 categorias
      Verificar: npm run audit
- [ ] T11.7 - Audit Lighthouse mobile 90+ en las 4 categorias
      Verificar: npm run audit:mobile
- [ ] T11.8 - Sitemap.xml y robots.txt automaticos
      Verificar: accesibles en /sitemap.xml y /robots.txt
- [ ] T11.9 - Verificar hreflang en todas las paginas
      Verificar: link alternate es/en/fr en el head
- [ ] T11.10 - Prefers-reduced-motion desactiva animaciones
      Verificar: activar en OS, web funciona sin animaciones
- [ ] T11.11 - Test cross-browser (Chrome, Firefox, Safari, Edge)
      Verificar: funcional en todos

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
