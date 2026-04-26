import { useAuthStore } from "../store/authStore";

export default function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Profile</h1>
        <p className="text-slate-400">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-3xl text-white shadow-lg">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">{user?.name || "User Name"}</h2>
            <p className="text-slate-400">{user?.role || "Member"}</p>
          </div>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input 
              type="email" 
              value={user?.email || ""}
              readOnly
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-400 focus:outline-none cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input 
              type="text" 
              defaultValue={user?.name || ""}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors" 
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
