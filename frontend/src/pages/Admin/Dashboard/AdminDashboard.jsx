import { useEffect, useState } from "react";

import {
    BookOpen,
    Users,
    CreditCard,
    CircleDollarSign,
    CalendarCheck,
    BookMarked,
    Tags,
    WalletCards,
    RefreshCw,
} from "lucide-react";

import {
    AdminPage,
    AdminCard,
    StatCard,
    StatusBadge,
    LoadingState,
    ErrorState,
    Table,
    Button,
} from "../../../component/admin/AdminUI";

import { adminApi } from "../../../services/adminApi";

export default function AdminDashboard() {

    const [state, setState] = useState({
        books: 0,
        available: 0,
        users: 0,
        subscriptions: 0,
        fines: 0,
        reservations: 0,
        loans: 0,
        genres: 0,
        payments: 0,
    });

    const [recent, setRecent] = useState({
        loans: [],
        reservations: [],
        payments: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = async () => {

        setLoading(true);

        const results =
            await Promise.allSettled([
                adminApi.books.stats(),
                adminApi.users.list(),
                adminApi.subscriptions.list(),
                adminApi.fines.list({
                    page: 0,
                    size: 5,
                }),
                adminApi.reservations.list({
                    page: 0,
                    size: 5,
                }),
                adminApi.loans.search({
                    page: 0,
                    size: 5,
                    sortBy: "createdAt",
                    sortDirection: "DESC",
                }),
                adminApi.genres.count(),
                adminApi.payments.list({
                    page: 0,
                    size: 5,
                    sortBy: "createdAt",
                    sortDir: "DESC",
                }),
            ]);

        const val = (i) =>
            results[i].status === "fulfilled"
                ? results[i].value
                : null;

        const books = val(0);
        const users = val(1);
        const subscriptions = val(2);
        const fines = val(3);
        const reservations = val(4);
        const loans = val(5);
        const genres = val(6);
        const payments = val(7);

        setState({
            books: books?.totalActiveBooks ?? 0,
            available:
                books?.totalAvailableBooks ?? 0,
            users: users?.length ?? 0,
            subscriptions:
                subscriptions?.length ?? 0,
            fines:
                fines?.totalElements ?? 0,
            reservations:
                reservations?.totalElements ?? 0,
            loans:
                loans?.totalElements ?? 0,
            genres: Number(genres ?? 0),
            payments:
                payments?.totalElements ?? 0,
        });

        setRecent({
            loans: loans?.content ?? [],
            reservations:
                reservations?.content ?? [],
            payments:
                payments?.content ?? [],
        });

        if (
            results.every(
                (r) => r.status === "rejected"
            )
        ) {
            setError(
                "Unable to load dashboard data."
            );
        } else {
            setError("");
        }

        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    if (loading) {
        return (
            <AdminPage
                title="Dashboard Overview"
                subtitle="Welcome back! Here's what's happening in your library today."
            >
                <LoadingState />
            </AdminPage>
        );
    }

    if (error) {
        return (
            <AdminPage
                title="Dashboard Overview"
                action={
                    <Button
                        variant="secondary"
                        onClick={load}
                    >
                        <RefreshCw
                            size={13}
                            className="inline mr-1"
                        />
                        Retry
                    </Button>
                }
            >
                <ErrorState message={error} />
            </AdminPage>
        );
    }

    return (
        <AdminPage
            title="Dashboard Overview"
            subtitle="Welcome back! Here's what's happening in your library today."
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

            <div className="admin-stat-scroll">
                <div className="admin-stat-grid">

                <StatCard
                    label="Total Books"
                    value={state.books}
                    icon={BookOpen}
                    tone="purple"
                    gradient
                    subtext={`${state.available} available`}
                />

                <StatCard
                    label="Active Users"
                    value={state.users}
                    icon={Users}
                    tone="green"
                    gradient
                />

                <StatCard
                    label="Loans"
                    value={state.loans}
                    icon={BookMarked}
                    tone="blue"
                    gradient
                />

                <StatCard
                    label="Outstanding Fines"
                    value={state.fines}
                    icon={CircleDollarSign}
                    tone="orange"
                    gradient
                />

                <StatCard
                    label="Reservations"
                    value={state.reservations}
                    icon={CalendarCheck}
                    tone="purple"
                    gradient
                />

                <StatCard
                    label="Subscriptions Loaded"
                    value={state.subscriptions}
                    icon={CreditCard}
                    tone="purple"
                    gradient
                    subtext="Current API response"
                />

                <StatCard
                    label="Active Genres"
                    value={state.genres}
                    icon={Tags}
                    tone="cyan"
                    gradient
                />

                <StatCard
                    label="Payments"
                    value={state.payments}
                    icon={WalletCards}
                    tone="blue"
                    gradient
                />

                </div>
            </div>


            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

                <AdminCard className="xl:col-span-2">

                    <div className="px-5 py-4 border-b border-gray-100">

                        <h3 className="text-sm font-bold">
                            Recent Book Loans
                        </h3>

                        <p className="text-[10px] text-gray-400 mt-1">
                            Latest loan records returned by the backend
                        </p>

                    </div>

                    <Table
                        columns={[
                            {
                                key: "bookTitle",
                                label: "Book",
                            },
                            {
                                key: "userName",
                                label: "Member",
                            },
                            {
                                key: "checkoutDate",
                                label: "Checkout",
                            },
                            {
                                key: "dueDate",
                                label: "Due",
                            },
                            {
                                key: "status",
                                label: "Status",
                                render: (r) => (
                                    <StatusBadge
                                        value={r.status}
                                    />
                                ),
                            },
                        ]}
                        rows={recent.loans}
                        emptyText="No recent loans."
                    />

                </AdminCard>


                <AdminCard>

                    <div className="px-5 py-4 border-b border-gray-100">

                        <h3 className="text-sm font-bold">
                            Quick Stats
                        </h3>

                        <p className="text-[10px] text-gray-400 mt-1">
                            Operational snapshot
                        </p>

                    </div>

                    <div className="p-5 space-y-4">

                        <Quick
                            label="Available book copies"
                            value={state.available}
                        />

                        <Quick
                            label="Reservations"
                            value={state.reservations}
                        />

                        <Quick
                            label="Subscriptions returned"
                            value={state.subscriptions}
                        />

                        <Quick
                            label="Payments"
                            value={state.payments}
                        />

                    </div>

                </AdminCard>

            </div>


            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

                <AdminCard>

                    <div className="px-5 py-4 border-b border-gray-100">

                        <h3 className="text-sm font-bold">
                            Recent Reservations
                        </h3>

                    </div>

                    <Table
                        columns={[
                            {
                                key: "bookTitle",
                                label: "Book",
                            },
                            {
                                key: "userName",
                                label: "Member",
                            },
                            {
                                key: "queuePosition",
                                label: "Queue",
                            },
                            {
                                key: "status",
                                label: "Status",
                                render: (r) => (
                                    <StatusBadge
                                        value={r.status}
                                    />
                                ),
                            },
                        ]}
                        rows={recent.reservations}
                        emptyText="No recent reservations."
                    />

                </AdminCard>


                <AdminCard>

                    <div className="px-5 py-4 border-b border-gray-100">

                        <h3 className="text-sm font-bold">
                            Recent Payments
                        </h3>

                    </div>

                    <Table
                        columns={[
                            {
                                key: "transactionId",
                                label: "Transaction",
                            },
                            {
                                key: "userName",
                                label: "Member",
                            },
                            {
                                key: "amount",
                                label: "Amount",
                                render: (r) =>
                                    `${r.currency || "INR"} ${
                                        r.amount ?? 0
                                    }`,
                            },
                            {
                                key: "status",
                                label: "Status",
                                render: (r) => (
                                    <StatusBadge
                                        value={r.status}
                                    />
                                ),
                            },
                        ]}
                        rows={recent.payments}
                        emptyText="No recent payments."
                    />

                </AdminCard>

            </div>

        </AdminPage>
    );
}

function Quick({ label, value }) {

    return (
        <div className="flex items-center justify-between border-b border-gray-50 pb-3">

            <span className="text-[11px] text-gray-500">
                {label}
            </span>

            <strong className="text-sm text-gray-900">
                {value}
            </strong>

        </div>
    );
}