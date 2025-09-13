import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function MemberDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Member Dashboard</h1>
      <p className="mt-2 text-base-content/70">
        Signed in as <span className="font-medium">{session?.user?.email}</span>{" "}
        (role: <span className="font-medium">{(session?.user as any)?.role}</span>)
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">My Profile</h2>
            <p>Update name/phone, upload a profile photo.</p>
            <div className="card-actions">
              <a className="btn btn-primary" href="/member/profile">Open</a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Monthly Fees</h2>
            <p>See dues and payment status.</p>
            <div className="card-actions">
              <a className="btn btn-primary" href="/member/fees">Open</a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Donations</h2>
            <p>View history and donate to campaigns.</p>
            <div className="card-actions">
              <a className="btn btn-primary" href="/member/donations">Open</a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Announcements & Events</h2>
            <p>Stay updated on foundation activities.</p>
            <div className="card-actions">
              <a className="btn btn-primary" href="/announcements">Open</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
