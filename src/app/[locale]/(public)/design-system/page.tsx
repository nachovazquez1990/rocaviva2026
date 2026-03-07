"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

/* ── Accent palette options for the user to compare ── */
const accentOptions = {
  navy: {
    label: "Navy (Elegante)",
    colors: {
      500: "#4a6fa5",
      600: "#334e7b",
      700: "#243b5e",
      800: "#1a2d47",
    },
  },
  gold: {
    label: "Gold (Cultural)",
    colors: {
      500: "#b8860b",
      600: "#9a7b2c",
      700: "#7a6118",
      800: "#5c4a12",
    },
  },
  teal: {
    label: "Teal (Fresco)",
    colors: {
      500: "#0d9488",
      600: "#0f766e",
      700: "#115e59",
      800: "#134e4a",
    },
  },
};

/* ── Brand palette ── */
const brandColors = [
  { name: "50", value: "#fef2f2" },
  { name: "100", value: "#fde3e1" },
  { name: "200", value: "#fccbc8" },
  { name: "300", value: "#f9a8a3" },
  { name: "400", value: "#f4726b" },
  { name: "500", value: "#e84b42" },
  { name: "600", value: "#c32e25" },
  { name: "700", value: "#a4231b" },
  { name: "800", value: "#882115" },
  { name: "900", value: "#751f17" },
  { name: "950", value: "#400c08" },
];

const neutralColors = [
  { name: "50", value: "#fafaf9" },
  { name: "100", value: "#f5f5f4" },
  { name: "200", value: "#e7e5e4" },
  { name: "300", value: "#d6d3d1" },
  { name: "400", value: "#a8a29e" },
  { name: "500", value: "#78716c" },
  { name: "600", value: "#57534e" },
  { name: "700", value: "#44403c" },
  { name: "800", value: "#292524" },
  { name: "900", value: "#1c1917" },
  { name: "950", value: "#0c0a09" },
];

/* ── Animations ── */
import type { Easing } from "framer-motion";
const ease: Easing = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

/* ── Input style options ── */
type InputStyle = "bordered" | "underline" | "filled";

export default function DesignSystemPage() {
  const [selectedAccent, setSelectedAccent] = useState<keyof typeof accentOptions>("navy");
  const [inputStyle, setInputStyle] = useState<InputStyle>("bordered");

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ─── HEADER ─── */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
            ROCAVIVA
          </h1>
          <nav className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase text-neutral-500">
            <a href="#colors" className="hover:text-brand-600 transition-colors">Colores</a>
            <a href="#typography" className="hover:text-brand-600 transition-colors">Tipografia</a>
            <a href="#buttons" className="hover:text-brand-600 transition-colors">Botones</a>
            <a href="#inputs" className="hover:text-brand-600 transition-colors">Inputs</a>
            <a href="#cards" className="hover:text-brand-600 transition-colors">Cards</a>
            <a href="#animations" className="hover:text-brand-600 transition-colors">Animaciones</a>
          </nav>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 pt-24 pb-16"
      >
        <motion.p
          variants={fadeInUp}
          className="text-sm font-medium tracking-[0.3em] uppercase text-brand-600 mb-4"
        >
          Design System Preview
        </motion.p>
        <motion.h2
          variants={fadeInUp}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-neutral-900 leading-[0.9]"
        >
          Rocaviva
          <br />
          <span className="text-brand-600">Eventos</span>
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mt-8 text-xl text-neutral-500 max-w-xl leading-relaxed"
        >
          Exposiciones culturales que celebran las grandes figuras de la historia.
          Un viaje a traves del arte, la ciencia y la literatura.
        </motion.p>
      </motion.section>

      <div className="max-w-7xl mx-auto px-6 space-y-32 pb-32">
        {/* ─── COLORS ─── */}
        <section id="colors">
          <SectionTitle>Paleta de Colores</SectionTitle>

          {/* Brand */}
          <h3 className="text-sm font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4">
            Brand — Rocaviva Red
          </h3>
          <div className="grid grid-cols-11 gap-1 mb-12">
            {brandColors.map((c) => (
              <div key={c.name} className="text-center">
                <div
                  className="aspect-square rounded-sm mb-2"
                  style={{ backgroundColor: c.value }}
                />
                <p className="text-xs text-neutral-500">{c.name}</p>
                <p className="text-[10px] text-neutral-400 font-mono">{c.value}</p>
              </div>
            ))}
          </div>

          {/* Accent options */}
          <h3 className="text-sm font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4">
            Accent — Elige una opcion
          </h3>
          <div className="flex gap-4 mb-6">
            {(Object.keys(accentOptions) as Array<keyof typeof accentOptions>).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedAccent(key)}
                className={cn(
                  "px-4 py-2 text-sm font-medium tracking-wide uppercase transition-all",
                  selectedAccent === key
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                )}
              >
                {accentOptions[key].label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {Object.entries(accentOptions[selectedAccent].colors).map(([shade, value]) => (
              <div key={shade} className="text-center">
                <div
                  className="h-20 rounded-sm mb-2"
                  style={{ backgroundColor: value }}
                />
                <p className="text-xs text-neutral-500">{shade}</p>
                <p className="text-[10px] text-neutral-400 font-mono">{value}</p>
              </div>
            ))}
          </div>
          {/* Show accent in context */}
          <div className="mt-6 p-8 bg-white flex items-center gap-6">
            <div
              className="w-3 h-16"
              style={{ backgroundColor: accentOptions[selectedAccent].colors[600] }}
            />
            <div>
              <p className="font-display text-2xl font-bold text-neutral-900">
                Exposicion en Madrid
              </p>
              <p
                className="text-sm font-medium tracking-wide uppercase mt-1"
                style={{ color: accentOptions[selectedAccent].colors[600] }}
              >
                Centro Cultural — 15 Mar — 30 Jun 2026
              </p>
            </div>
          </div>

          {/* Neutral */}
          <h3 className="text-sm font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4 mt-12">
            Neutral — Warm Stone
          </h3>
          <div className="grid grid-cols-11 gap-1 mb-8">
            {neutralColors.map((c) => (
              <div key={c.name} className="text-center">
                <div
                  className="aspect-square rounded-sm mb-2 border border-neutral-200"
                  style={{ backgroundColor: c.value }}
                />
                <p className="text-xs text-neutral-500">{c.name}</p>
              </div>
            ))}
          </div>

          {/* Semantic */}
          <h3 className="text-sm font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4">
            Semanticos
          </h3>
          <div className="flex gap-4">
            {[
              { name: "Success", color: "#16a34a" },
              { name: "Warning", color: "#d97706" },
              { name: "Error", color: "#dc2626" },
              { name: "Info", color: "#2563eb" },
            ].map((s) => (
              <div key={s.name} className="text-center">
                <div
                  className="w-16 h-16 rounded-sm mb-2"
                  style={{ backgroundColor: s.color }}
                />
                <p className="text-xs text-neutral-500">{s.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── TYPOGRAPHY ─── */}
        <section id="typography">
          <SectionTitle>Tipografia</SectionTitle>

          <div className="space-y-8 mb-16">
            <div>
              <p className="text-xs text-neutral-400 font-mono mb-2">
                font-display / Bodoni Moda — Display
              </p>
              <p className="font-display text-7xl md:text-8xl lg:text-[7rem] font-bold tracking-tight text-neutral-900 leading-[0.85]">
                Mujeres Nobel
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400 font-mono mb-2">
                font-display / Bodoni Moda — H1
              </p>
              <p className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 leading-[0.9]">
                Exposiciones Culturales
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400 font-mono mb-2">
                font-display / Bodoni Moda — H2
              </p>
              <p className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900">
                Teresa de Jesus
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400 font-mono mb-2">
                font-display / Bodoni Moda — H3
              </p>
              <p className="font-display text-2xl md:text-3xl font-semibold text-neutral-900">
                Itinerancia por Europa
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400 font-mono mb-2">
                font-display / Bodoni Moda — H3 italic
              </p>
              <p className="font-display text-2xl md:text-3xl font-semibold italic text-neutral-900">
                &ldquo;El arte de descubrir la historia&rdquo;
              </p>
            </div>

            <hr className="border-neutral-200" />

            <div>
              <p className="text-xs text-neutral-400 font-mono mb-2">
                font-sans / Inter — Body Large
              </p>
              <p className="text-lg md:text-xl text-neutral-700 leading-relaxed max-w-2xl">
                Rocaviva Eventos lleva mas de una decada creando exposiciones culturales que recorren
                el mundo, acercando la historia y el arte a millones de visitantes.
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400 font-mono mb-2">
                font-sans / Inter — Body
              </p>
              <p className="text-base text-neutral-600 leading-relaxed max-w-2xl">
                Cada exposicion es un viaje inmersivo a traves de la vida y obra de grandes figuras
                historicas. Desde premios Nobel hasta astronautas, nuestras muestras combinan rigor
                academico con una experiencia visual impactante.
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400 font-mono mb-2">
                font-sans / Inter — Caption / Uppercase tracking
              </p>
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-neutral-500">
                Exposiciones itinerantes — Desde 2010
              </p>
            </div>
          </div>

          {/* Type scale combo example */}
          <div className="bg-white p-12">
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-brand-600 mb-4">
              Proyecto Destacado
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 leading-[0.9] mb-6">
              Maria
              <br />
              Sklodowska-Curie
            </h2>
            <p className="text-lg text-neutral-500 leading-relaxed max-w-lg mb-8">
              La primera persona en recibir dos premios Nobel en distintas especialidades.
              Una exposicion que recorre su extraordinaria vida.
            </p>
            <button className="bg-brand-600 text-white px-8 py-3 text-sm font-medium tracking-[0.15em] uppercase hover:bg-brand-700 transition-colors">
              Ver Exposicion
            </button>
          </div>
        </section>

        {/* ─── BUTTONS ─── */}
        <section id="buttons">
          <SectionTitle>Botones</SectionTitle>
          <p className="text-sm text-neutral-500 mb-8">
            Sharp (sin border-radius) + cambio de color suave en hover
          </p>

          <div className="space-y-12">
            {/* Primary */}
            <div>
              <p className="text-xs text-neutral-400 font-mono mb-4">Primary</p>
              <div className="flex flex-wrap gap-4 items-center">
                <FillButton variant="primary" size="lg">Ver Proyectos</FillButton>
                <FillButton variant="primary" size="md">Descargar Dossier</FillButton>
                <FillButton variant="primary" size="sm">Contactar</FillButton>
                <FillButton variant="primary" size="md" disabled>Desactivado</FillButton>
              </div>
            </div>

            {/* Secondary */}
            <div>
              <p className="text-xs text-neutral-400 font-mono mb-4">Secondary</p>
              <div className="flex flex-wrap gap-4 items-center">
                <FillButton variant="secondary" size="lg">Ver Proyectos</FillButton>
                <FillButton variant="secondary" size="md">Descargar Dossier</FillButton>
                <FillButton variant="secondary" size="sm">Contactar</FillButton>
              </div>
            </div>

            {/* Outline */}
            <div>
              <p className="text-xs text-neutral-400 font-mono mb-4">Outline</p>
              <div className="flex flex-wrap gap-4 items-center">
                <FillButton variant="outline" size="lg">Ver Proyectos</FillButton>
                <FillButton variant="outline" size="md">Descargar Dossier</FillButton>
                <FillButton variant="outline" size="sm">Contactar</FillButton>
              </div>
            </div>

            {/* Ghost */}
            <div>
              <p className="text-xs text-neutral-400 font-mono mb-4">Ghost</p>
              <div className="flex flex-wrap gap-4 items-center">
                <FillButton variant="ghost" size="lg">Ver Proyectos</FillButton>
                <FillButton variant="ghost" size="md">Descargar Dossier</FillButton>
                <FillButton variant="ghost" size="sm">Contactar</FillButton>
              </div>
            </div>
          </div>
        </section>

        {/* ─── INPUTS ─── */}
        <section id="inputs">
          <SectionTitle>Inputs</SectionTitle>
          <p className="text-sm text-neutral-500 mb-6">
            Elige el estilo que prefieras:
          </p>

          <div className="flex gap-4 mb-10">
            {(["bordered", "underline", "filled"] as const).map((style) => (
              <button
                key={style}
                onClick={() => setInputStyle(style)}
                className={cn(
                  "px-4 py-2 text-sm font-medium tracking-wide uppercase transition-all",
                  inputStyle === style
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                )}
              >
                {style}
              </button>
            ))}
          </div>

          <div className="max-w-md space-y-6 bg-white p-10">
            <DemoInput style={inputStyle} label="Nombre completo" placeholder="Maria Curie" />
            <DemoInput style={inputStyle} label="Email" placeholder="maria@ejemplo.com" type="email" />
            <DemoInput
              style={inputStyle}
              label="Profesion"
              placeholder="Investigadora"
              error="Este campo es obligatorio"
            />
            <DemoTextarea style={inputStyle} label="Comentarios" placeholder="Escribe tu mensaje..." />
          </div>
        </section>

        {/* ─── CARDS ─── */}
        <section id="cards">
          <SectionTitle>Cards</SectionTitle>
          <p className="text-sm text-neutral-500 mb-8">
            Sin borde, separacion por fondo blanco sobre neutral-50. Hover sutil.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Mujeres Nobel",
                desc: "Las mujeres que cambiaron el mundo a traves de la ciencia, la paz y la literatura.",
                tag: "12 itinerancias",
              },
              {
                title: "Teresa de Jesus",
                desc: "Un viaje por la vida y obra de la gran mistica espanola del Siglo de Oro.",
                tag: "8 itinerancias",
              },
              {
                title: "Astronautas",
                desc: "La aventura humana en el espacio, desde los pioneros hasta las misiones actuales.",
                tag: "5 itinerancias",
              },
            ].map((card, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease }}
                className="group bg-white p-8 hover:shadow-lg transition-shadow duration-500 cursor-pointer"
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] bg-neutral-200 mb-6 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:scale-105 transition-transform duration-700" />
                </div>
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-brand-600 mb-2">
                  {card.tag}
                </p>
                <h3 className="font-display text-2xl font-bold text-neutral-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {card.desc}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-neutral-900 group-hover:text-brand-600 transition-colors">
                  <span className="tracking-wide uppercase">Ver proyecto</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ─── ANIMATIONS ─── */}
        <section id="animations">
          <SectionTitle>Animaciones</SectionTitle>
          <p className="text-sm text-neutral-500 mb-8">
            Nivel medio: fade-in-up, stagger, parallax suave. Scroll para ver.
          </p>

          {/* Fade in up */}
          <div className="mb-16">
            <p className="text-xs text-neutral-400 font-mono mb-6">fadeInUp (scroll triggered)</p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="bg-white p-12"
            >
              <p className="font-display text-4xl font-bold text-neutral-900">
                Cada exposicion cuenta una historia
              </p>
            </motion.div>
          </div>

          {/* Stagger children */}
          <div className="mb-16">
            <p className="text-xs text-neutral-400 font-mono mb-6">staggerChildren</p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-4 gap-4"
            >
              {["Ciencia", "Literatura", "Paz", "Arte"].map((word) => (
                <motion.div
                  key={word}
                  variants={staggerItem}
                  className="bg-white p-8 text-center"
                >
                  <p className="font-display text-2xl font-bold text-neutral-900">{word}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Scale on hover */}
          <div className="mb-16">
            <p className="text-xs text-neutral-400 font-mono mb-6">hover scale + image zoom</p>
            <div className="grid grid-cols-2 gap-6">
              {["Concha Espina", "Margarita Salas"].map((name, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease }}
                  className="group bg-white overflow-hidden cursor-pointer"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-neutral-200 to-neutral-300 overflow-hidden">
                    <motion.div
                      className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <div className="p-6">
                    <p className="font-display text-xl font-bold text-neutral-900">{name}</p>
                    <p className="text-sm text-neutral-500 mt-1">Exposicion itinerante</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Line reveal */}
          <div>
            <p className="text-xs text-neutral-400 font-mono mb-6">line reveal divider</p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease }}
              className="h-px bg-brand-600 origin-left"
            />
          </div>
        </section>

        {/* ─── FULL COMBO ─── */}
        <section>
          <SectionTitle>Ejemplo Completo</SectionTitle>
          <p className="text-sm text-neutral-500 mb-8">
            Asi se veria una seccion de la web combinando todo el design system.
          </p>

          <div className="bg-white">
            <div className="p-12 md:p-20">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.p
                  variants={staggerItem}
                  className="text-sm font-medium tracking-[0.3em] uppercase text-brand-600 mb-6"
                >
                  Quienes Somos
                </motion.p>
                <motion.h2
                  variants={staggerItem}
                  className="font-display text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[0.9] mb-8"
                >
                  Cultura que
                  <br />
                  <span className="italic">inspira</span>
                </motion.h2>
                <motion.div
                  variants={staggerItem}
                  className="h-px w-24 bg-brand-600 mb-8"
                />
                <motion.p
                  variants={staggerItem}
                  className="text-lg text-neutral-500 leading-relaxed max-w-2xl mb-10"
                >
                  Rocaviva Eventos es una empresa dedicada a la creacion y gestion de exposiciones
                  culturales itinerantes que recorren museos, centros culturales y espacios publicos
                  de todo el mundo.
                </motion.p>
                <motion.div variants={staggerItem}>
                  <FillButton variant="primary" size="lg">Descubre Nuestros Proyectos</FillButton>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Section Title helper ── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
        {children}
      </h2>
      <div className="mt-4 h-px w-16 bg-brand-600" />
    </div>
  );
}

/* ── Button (color change only, no fill animation) ── */
function FillButton({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
}: {
  variant: "primary" | "secondary" | "outline" | "ghost";
  size: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const sizes = {
    sm: "px-5 py-2 text-xs",
    md: "px-7 py-3 text-sm",
    lg: "px-10 py-4 text-sm",
  };

  const base = cn(
    "font-medium tracking-[0.15em] uppercase transition-colors duration-300",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
    sizes[size],
    disabled && "opacity-40 cursor-not-allowed pointer-events-none"
  );

  const variants = {
    primary: cn(base, "bg-brand-600 text-white hover:bg-brand-700"),
    secondary: cn(base, "bg-neutral-900 text-white hover:bg-neutral-800"),
    outline: cn(base, "border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"),
    ghost: cn(base, "text-neutral-900 hover:bg-neutral-100"),
  };

  return (
    <button disabled={disabled} className={variants[variant]}>
      {children}
    </button>
  );
}

/* ── Demo Input ── */
function DemoInput({
  style,
  label,
  placeholder,
  type = "text",
  error,
}: {
  style: InputStyle;
  label: string;
  placeholder: string;
  type?: string;
  error?: string;
}) {
  const styles: Record<InputStyle, string> = {
    bordered: cn(
      "w-full px-4 py-3 bg-white border text-neutral-900 placeholder:text-neutral-400",
      "focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-colors",
      error ? "border-red-500" : "border-neutral-300"
    ),
    underline: cn(
      "w-full px-0 py-3 bg-transparent border-b-2 text-neutral-900 placeholder:text-neutral-400",
      "focus:outline-none focus:border-brand-600 transition-colors",
      error ? "border-red-500" : "border-neutral-300"
    ),
    filled: cn(
      "w-full px-4 py-3 bg-neutral-100 border-2 border-transparent text-neutral-900 placeholder:text-neutral-400",
      "focus:outline-none focus:bg-white focus:border-brand-600 transition-all",
      error && "border-red-500 bg-red-50"
    ),
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
      <input type={type} placeholder={placeholder} className={styles[style]} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

/* ── Demo Textarea ── */
function DemoTextarea({
  style,
  label,
  placeholder,
}: {
  style: InputStyle;
  label: string;
  placeholder: string;
}) {
  const styles: Record<InputStyle, string> = {
    bordered: "w-full px-4 py-3 bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-colors resize-none",
    underline: "w-full px-0 py-3 bg-transparent border-b-2 border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-600 transition-colors resize-none",
    filled: "w-full px-4 py-3 bg-neutral-100 border-2 border-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-brand-600 transition-all resize-none",
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
      <textarea rows={4} placeholder={placeholder} className={styles[style]} />
    </div>
  );
}
