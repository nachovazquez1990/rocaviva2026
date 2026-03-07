"use client";

import { Download } from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  uniqueVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  countries: { country: string; count: number }[];
  locales: { locale: string; count: number }[];
  devices: { device: string; count: number }[];
  pages: { page: string; count: number }[];
  referrers: { referrer: string; count: number }[];
  eventsByType: { type: string; count: number }[];
  topClicks: { text: string; count: number }[];
  dailyViews: { date: string; views: number }[];
}

interface Props {
  data: AnalyticsData;
}

export function AnalyticsPdfExport({ data }: Props) {
  async function generatePdf() {
    const { jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();
    const now = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Title
    doc.setFontSize(20);
    doc.setTextColor(195, 46, 37); // brand-600
    doc.text("Rocaviva Eventos", 14, 20);
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text("Informe de Estadisticas", 14, 30);
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generado: ${now}`, 14, 37);

    doc.setDrawColor(195, 46, 37);
    doc.setLineWidth(0.5);
    doc.line(14, 40, 196, 40);

    let y = 48;

    // Overview
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text("Resumen General", 14, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [["Metrica", "Valor"]],
      body: [
        ["Visitas totales (historico)", data.totalViews.toLocaleString("es-ES")],
        ["Visitas hoy", data.todayViews.toLocaleString("es-ES")],
        ["Visitas esta semana", data.weekViews.toLocaleString("es-ES")],
        ["Visitas este mes", data.monthViews.toLocaleString("es-ES")],
        ["Visitantes unicos (mes)", data.uniqueVisitors.toLocaleString("es-ES")],
        ["Visitantes nuevos (mes)", data.newVisitors.toLocaleString("es-ES")],
        ["Visitantes recurrentes (mes)", data.returningVisitors.toLocaleString("es-ES")],
      ],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [195, 46, 37] },
      margin: { left: 14 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 12;

    // Countries
    if (data.countries.length > 0) {
      doc.setFontSize(13);
      doc.text("Paises", 14, y);
      y += 6;

      autoTable(doc, {
        startY: y,
        head: [["Pais", "Visitas", "%"]],
        body: data.countries.slice(0, 15).map((c) => [
          c.country,
          c.count.toLocaleString("es-ES"),
          data.monthViews > 0 ? `${Math.round((c.count / data.monthViews) * 100)}%` : "0%",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [51, 78, 123] },
        margin: { left: 14 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = (doc as any).lastAutoTable.finalY + 12;
    }

    // Check page break
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    // Languages
    if (data.locales.length > 0) {
      doc.setFontSize(13);
      doc.text("Idiomas", 14, y);
      y += 6;

      const localeLabels: Record<string, string> = { es: "Espanol", en: "English", fr: "Francais" };
      autoTable(doc, {
        startY: y,
        head: [["Idioma", "Visitas", "%"]],
        body: data.locales.map((l) => [
          localeLabels[l.locale] || l.locale,
          l.count.toLocaleString("es-ES"),
          data.monthViews > 0 ? `${Math.round((l.count / data.monthViews) * 100)}%` : "0%",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [51, 78, 123] },
        margin: { left: 14 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = (doc as any).lastAutoTable.finalY + 12;
    }

    // Devices
    if (data.devices.length > 0) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.text("Dispositivos", 14, y);
      y += 6;

      const deviceLabels: Record<string, string> = { desktop: "Escritorio", mobile: "Movil", tablet: "Tablet" };
      autoTable(doc, {
        startY: y,
        head: [["Dispositivo", "Visitas", "%"]],
        body: data.devices.map((d) => [
          deviceLabels[d.device] || d.device,
          d.count.toLocaleString("es-ES"),
          data.monthViews > 0 ? `${Math.round((d.count / data.monthViews) * 100)}%` : "0%",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [51, 78, 123] },
        margin: { left: 14 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = (doc as any).lastAutoTable.finalY + 12;
    }

    // Top pages
    if (data.pages.length > 0) {
      if (y > 200) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.text("Paginas mas vistas", 14, y);
      y += 6;

      autoTable(doc, {
        startY: y,
        head: [["Pagina", "Visitas"]],
        body: data.pages.slice(0, 20).map((p) => [p.page, p.count.toLocaleString("es-ES")]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [195, 46, 37] },
        margin: { left: 14 },
        columnStyles: { 0: { cellWidth: 140 } },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = (doc as any).lastAutoTable.finalY + 12;
    }

    // Referrers
    if (data.referrers.length > 0) {
      if (y > 220) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.text("Fuentes de trafico", 14, y);
      y += 6;

      autoTable(doc, {
        startY: y,
        head: [["Fuente", "Visitas"]],
        body: data.referrers.map((r) => [r.referrer, r.count.toLocaleString("es-ES")]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [51, 78, 123] },
        margin: { left: 14 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = (doc as any).lastAutoTable.finalY + 12;
    }

    // Events
    if (data.eventsByType.length > 0) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.text("Tipos de interaccion", 14, y);
      y += 6;

      const eventLabels: Record<string, string> = {
        click: "Clics",
        download: "Descargas",
        form_submit: "Formularios",
        dossier_download: "Dossiers",
      };
      autoTable(doc, {
        startY: y,
        head: [["Tipo", "Total"]],
        body: data.eventsByType.map((e) => [eventLabels[e.type] || e.type, e.count.toLocaleString("es-ES")]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [195, 46, 37] },
        margin: { left: 14 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = (doc as any).lastAutoTable.finalY + 12;
    }

    // Daily views table
    if (data.dailyViews.length > 0) {
      doc.addPage();
      y = 20;
      doc.setFontSize(13);
      doc.text("Visitas diarias (ultimos 30 dias)", 14, y);
      y += 6;

      autoTable(doc, {
        startY: y,
        head: [["Fecha", "Visitas"]],
        body: data.dailyViews.map((d) => [d.date, d.views.toLocaleString("es-ES")]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [51, 78, 123] },
        margin: { left: 14 },
      });
    }

    // Footer on all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Rocaviva Eventos - Informe de estadisticas - ${now}`, 14, 290);
      doc.text(`Pagina ${i}/${totalPages}`, 180, 290);
    }

    doc.save(`rocaviva-estadisticas-${new Date().toISOString().split("T")[0]}.pdf`);
  }

  return (
    <button
      type="button"
      onClick={generatePdf}
      className="flex items-center gap-2 px-4 py-2 bg-accent-600 text-white text-sm font-medium hover:bg-accent-700 transition-colors"
    >
      <Download size={16} />
      Descargar PDF
    </button>
  );
}
