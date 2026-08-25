import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    async function fetchInvitation() {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/invitations/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setInvitations(data);
    }

    fetchInvitation();
  }, []);

  async function handleRespond(invitationId, status) {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/invitations/${invitationId}/respond`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to respond to invitation");
      return;
    }
    toast.success(`Invitation ${status}!`);
    setInvitations((prev) => prev.filter((inv) => inv._id !== invitationId));
  }

  return (
    <div className="px-6 lg:px-10 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Invitations</h1>

      {invitations.length === 0 && (
        <p className="text-gray-500">No pending invitations.</p>
      )}

      <div className="flex flex-col gap-4 max-w-2xl">
        {invitations.map((invitation) => (
          <div
            key={invitation._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">You've been invited to join</p>
              <p className="font-semibold text-gray-900">Project {invitation.project}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleRespond(invitation._id, "accepted")}
                className="rounded-xl py-2 px-4 bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium cursor-pointer"
              >
                Accept
              </button>
              <button
                onClick={() => handleRespond(invitation._id, "rejected")}
                className="rounded-xl py-2 px-4 border border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors text-sm font-medium cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invitations;