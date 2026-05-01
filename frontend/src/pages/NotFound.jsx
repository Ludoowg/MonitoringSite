import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="rounded-xl bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">The page you requested does not exist.</p>
      <Link
        to="/"
        className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
