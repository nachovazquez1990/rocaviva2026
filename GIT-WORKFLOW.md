# Git Workflow - Rocaviva 2026

## Ramas

```
main ──────────────────────────────────── Produccion (rocaviva.eu)
  │
  └── dev ─────────────────────────────── Pre-produccion (rocaviva2026-xxx.vercel.app)
        │
        ├── fase/1-design-system ──────── Feature branch
        ├── fase/2-layout-navegacion
        ├── fase/3-home
        ├── fase/4-proyectos-listado
        ├── fase/5-proyecto-individual
        ├── fase/6-exposicion
        ├── fase/7-comunicacion
        ├── fase/8-libros
        ├── fase/9-colaboradores
        ├── fase/10-admin-cms
        ├── fase/11-polish
        ├── fase/12-migracion
        ├── fase/13-deploy
        │
        └── fix/nombre-del-fix ────────── Hotfix branches
```

## Flujo de trabajo

### 1. Crear rama de fase
```bash
git checkout dev
git pull origin dev
git checkout -b fase/1-design-system
```

### 2. Trabajar en la fase (commits frecuentes)
```bash
# Commits con prefijo de la tarea
git commit -m "feat(T1.1): definir paleta de colores y tokens CSS"
git commit -m "feat(T1.2): configurar tipografia Inter + Playfair"
git commit -m "feat(T1.3): crear componente Button con variantes"
```

### 3. Push y PR a dev
```bash
git push origin fase/1-design-system
# Crear PR: "feat: fase 1 - design system y tokens"
# El CI ejecuta: typecheck + lint + tests + build
# Vercel genera preview automatico de la PR
```

### 4. Merge a dev (pre-produccion)
```bash
# Tras aprobar la PR, merge a dev
# CI ejecuta checks completos
# Vercel despliega automaticamente a dominio gratuito (pre)
# Verificar en el dominio de pre-produccion
```

### 5. Merge a main (produccion)
```bash
# Cuando dev esta estable, crear PR de dev -> main
# PR title: "release: fase 1 - design system"
# CI ejecuta checks + Lighthouse audit
# Tras merge, ejecutar workflow "Version Tag"
```

## Versionado Semantico

### Patch (v0.0.X) - Cambios menores
- Hotfixes, typos, ajustes CSS
- Correccion de bugs
- Ejemplo: `fix(T2.3): corregir z-index del menu mobile`

### Minor (v0.X.0) - Features nuevas
- Cada fase completada
- Nueva seccion de la web
- Ejemplo: `feat: fase 3 - home page completa`

### Major (vX.0.0) - Cambios mayores
- v1.0.0 = Lanzamiento a produccion
- Redisenos completos de secciones
- Cambios de arquitectura significativos

### Versiones previstas
```
v0.1.0  - Fase 1: Design System
v0.2.0  - Fase 2: Layout y Navegacion
v0.3.0  - Fase 3: Home Page
v0.4.0  - Fase 4: Proyectos Listado
v0.5.0  - Fase 5: Proyecto Individual
v0.6.0  - Fase 6: Exposicion
v0.7.0  - Fase 7: Comunicacion
v0.8.0  - Fase 8: Libros
v0.9.0  - Fase 9: Colaboradores
v0.10.0 - Fase 10: Admin CMS
v0.11.0 - Fase 11: Polish y Optimizacion
v0.12.0 - Fase 12: Migracion de Contenido
v1.0.0  - Fase 13: Lanzamiento a produccion
```

## Convencion de commits

```
feat(TX.X): descripcion     # Nueva funcionalidad (tarea del roadmap)
fix(TX.X): descripcion      # Correccion de bug
style: descripcion           # Cambios de estilo/CSS
refactor: descripcion        # Refactorizacion sin cambio funcional
test: descripcion            # Anadir o modificar tests
chore: descripcion           # Configuracion, dependencias
docs: descripcion            # Documentacion
perf: descripcion            # Mejora de rendimiento
a11y: descripcion            # Mejora de accesibilidad
i18n: descripcion            # Traducciones
```

## Vercel Deployment

### Pre-produccion (dev)
- Branch: `dev`
- URL: `rocaviva2026-[hash].vercel.app` (automatico)
- Se despliega automaticamente en cada push a dev
- Usado para revisar antes de produccion

### Produccion (main)
- Branch: `main`
- URL: Dominio gratuito de Vercel hasta v1.0.0
- A partir de v1.0.0: `rocaviva.eu`
- Se despliega automaticamente en cada push a main

### Preview (PRs)
- Cada PR genera un deploy preview unico
- URL temporal para revisar cambios antes de merge

## Proteccion de ramas (configurar en GitHub)

### main
- Require PR para merge (no push directo)
- Require CI passing (quality + lighthouse)
- Require 1 approval (opcional si trabajas solo)

### dev
- Require PR para merge (no push directo)
- Require CI passing (quality checks)
