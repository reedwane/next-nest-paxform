export default function LoadingState() {
  return (
    <div className="p-12 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Loading appointments...</p>
    </div>
  );
}
