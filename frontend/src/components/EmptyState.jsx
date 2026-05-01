function EmptyState({ message = "No data available." }) {
  return (
    <div className="rounded-xl bg-white p-6 text-sm text-slate-500 shadow-sm">
      {message}
    </div>
  );
}

export default EmptyState;
