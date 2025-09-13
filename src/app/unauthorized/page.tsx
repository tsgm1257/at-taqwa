export default function Unauthorized() {
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold">Unauthorized</h1>
      <p className="mt-2 text-base-content/70">
        You don’t have permission to view this page. If you believe this is a mistake,
        please contact an administrator.
      </p>
    </div>
  );
}
