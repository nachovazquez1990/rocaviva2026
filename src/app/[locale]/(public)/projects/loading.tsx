export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-white/50 text-sm tracking-widest uppercase">
          Cargando...
        </span>
      </div>
    </div>
  );
}
