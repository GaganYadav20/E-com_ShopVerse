export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="spinner"></div>
        <p className="text-dark-400 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
