import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield } from "lucide-react";
import { usersApi } from "../api/users";
import { apiErrorMessage } from "../api/client";

const roles = ["ADMIN", "MANAGER", "DEVELOPER"];

export default function Admin() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.list,
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }) => usersApi.updateRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Admin</h1>
        <p className="text-slate-400">Manage users and role-based access.</p>
      </div>

      {isLoading && <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-300">Loading users...</div>}
      {error && <div className="bg-slate-900 border border-red-900 rounded-xl p-6 text-red-300">{apiErrorMessage(error, "Unable to load users.")}</div>}

      {!isLoading && !error && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((member) => (
                <tr key={member.id} className="border-t border-slate-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                        <Shield className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-100">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{member.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={member.role}
                      onChange={(e) => updateRole.mutate({ id: member.id, role: e.target.value })}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
