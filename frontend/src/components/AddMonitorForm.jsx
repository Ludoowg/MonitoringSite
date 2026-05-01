import { useState } from "react";

function AddMonitorForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState({ name: "", url: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.url.trim()) {
      nextErrors.url = "URL is required.";
    } else if (!/^https?:\/\//i.test(form.url.trim())) {
      nextErrors.url = "URL must start with http:// or https://";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    await onSubmit({ name: form.name.trim(), url: form.url.trim() });
    setForm({ name: "", url: "" });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-slate-800">Add monitor</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name}</p> : null}
        </div>
        <div>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="https://example.com"
            value={form.url}
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
          />
          {errors.url ? <p className="mt-1 text-xs text-rose-600">{errors.url}</p> : null}
        </div>
      </div>
      <button
        disabled={isLoading}
        className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {isLoading ? "Adding..." : "Add monitor"}
      </button>
    </form>
  );
}

export default AddMonitorForm;
