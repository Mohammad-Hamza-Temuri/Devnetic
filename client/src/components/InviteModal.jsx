import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Search } from "lucide-react";

const InviteModal = ({ projectId, isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Debounced search — waits 500ms after the user stops typing
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!searchTerm) {
                setResults([]);
                return;
            }

            setLoading(true);
            const res = await fetch(`http://localhost:3000/profile?search=${searchTerm}`);
            const data = await res.json();
            setResults(data);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    async function handleInvite(userId) {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:3000/invitations/${projectId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ invitedUserId: userId }),
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message || "Failed to send invitation");
            return;
        }

        toast.success("Invitation sent!");
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    <X size={20} />
                </button>

                <h2 className="text-lg font-bold text-gray-900 mb-4">Invite a Developer</h2>

                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by headline..."
                        className="w-full bg-white rounded-xl border border-gray-300 py-2.5 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="mt-4 max-h-64 overflow-y-auto flex flex-col gap-2">
                    {loading && <p className="text-sm text-gray-400">Searching...</p>}

                    {!loading && searchTerm && results.length === 0 && (
                        <p className="text-sm text-gray-400">No developers found.</p>
                    )}

                    {results.map((profile) => (
                        <button
                            key={profile._id}
                            onClick={() => handleInvite(profile.user)}
                            className="flex items-center justify-between text-left p-3 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                        >
                            <div>
                                <p className="font-medium text-gray-900">{profile.headline}</p>
                                <p className="text-xs text-gray-500">{profile.availability}</p>
                            </div>
                            <span className="text-xs text-primary font-medium">Invite</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InviteModal;