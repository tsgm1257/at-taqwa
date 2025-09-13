import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-base-content/70">
        Signed in as <span className="font-medium">{session?.user?.email}</span>{" "}
        (role: <span className="font-medium">{(session?.user as any)?.role}</span>)
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Manage Projects & Campaigns</h2>
            <p>Create/update campaigns, set targets, monitor progress.</p>
            <div className="card-actions">
              <a className="btn btn-primary" href="/admin/projects">Open</a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Membership Requests</h2>
            <p>Approve or deny member applications.</p>
            <div className="card-actions">
              <a className="btn btn-primary" href="/admin/members">Open</a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Announcements & Events</h2>
            <p>Publish notices, schedule meetings, set reunions.</p>
            <div className="card-actions">
              <a className="btn btn-primary" href="/admin/announcements">Open</a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Financial Reports</h2>
            <p>Upload monthly income/expense/balance PDFs.</p>
            <div className="card-actions">
              <a className="btn btn-primary" href="/admin/reports">Open</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
