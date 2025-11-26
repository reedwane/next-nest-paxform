interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="p-12 text-center">
      <p className="text-red-600">{message}</p>
    </div>
  );
}
