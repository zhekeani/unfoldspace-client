export default function PageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Core rotating element */}
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />

        {/* Pulsing effect */}
        <div className="absolute h-14 w-14 border-4 border-primary/30 rounded-full animate-ping" />
      </div>
    </div>
  );
}
