function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      {message}
    </div>
  );
}

export default ErrorState;
