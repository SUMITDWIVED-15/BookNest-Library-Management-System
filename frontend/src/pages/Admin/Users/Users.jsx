import { useEffect, useState } from "react";

import {
    Users as UsersIcon,
    ShieldCheck,
    RefreshCw,
} from "lucide-react";

import {
    AdminPage,
    AdminCard,
    StatCard,
    SearchBar,
    StatusBadge,
    LoadingState,
    ErrorState,
    Table,
    Button,
} from "../../../component/admin/AdminUI";

import { adminApi } from "../../../services/adminApi";

export default function Users() {

    const [users, setUsers] =
        useState([]);

    const [q, setQ] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const load = async () => {

        setLoading(true);

        try {

            setUsers(
                await adminApi.users.list()
            );

            setError("");

        } catch (e) {

            setError(
                e.response?.data?.message ||
                    "Unable to load users."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        load();
    }, []);


    const rows = users.filter(
        (u) =>
            `${u.fullName} ${u.email} ${u.userName} ${u.role} ${u.phone}`
                .toLowerCase()
                .includes(q.toLowerCase())
    );


    return (
        <AdminPage
            title="User Management"
            subtitle="View registered members and account roles"
            action={
                <Button
                    variant="secondary"
                    onClick={load}
                >
                    <RefreshCw
                        size={13}
                        className="inline mr-1"
                    />
                    Refresh
                </Button>
            }
        >

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">

                <StatCard
                    label="Total Users"
                    value={users.length}
                    icon={UsersIcon}
                />

                <StatCard
                    label="Admin Users"
                    value={
                        users.filter(
                            (x) =>
                                String(
                                    x.role
                                ).includes(
                                    "ADMIN"
                                )
                        ).length
                    }
                    icon={ShieldCheck}
                    tone="orange"
                />

                <StatCard
                    label="Regular Users"
                    value={
                        users.filter(
                            (x) =>
                                !String(
                                    x.role
                                ).includes(
                                    "ADMIN"
                                )
                        ).length
                    }
                    tone="blue"
                />

            </div>


            <AdminCard>

                <div className="p-4 border-b border-gray-100">

                    <SearchBar
                        value={q}
                        onChange={setQ}
                        placeholder="Search name, email, username or phone"
                    />

                </div>


                {error ? (
                    <ErrorState message={error} />
                ) : loading ? (
                    <LoadingState />
                ) : (
                    <Table
                        columns={[
                            {
                                key: "id",
                                label: "#",
                            },

                            {
                                key: "fullName",
                                label: "Member",
                                render: (r) => (
                                    <div>
                                        <p className="font-semibold">
                                            {r.fullName}
                                        </p>

                                        <p className="text-[9px] text-gray-400">
                                            {r.email}
                                        </p>
                                    </div>
                                ),
                            },

                            {
                                key: "userName",
                                label: "Username",
                            },

                            {
                                key: "phone",
                                label: "Phone",
                            },

                            {
                                key: "role",
                                label: "Role",
                                render: (r) => (
                                    <StatusBadge
                                        value={
                                            r.role
                                        }
                                    />
                                ),
                            },

                            {
                                key: "lastLogin",
                                label: "Last Login",
                            },
                        ]}
                        rows={rows}
                    />
                )}

            </AdminCard>

        </AdminPage>
    );
}