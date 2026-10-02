import { useEffect, useState } from "react";

import {
    RefreshCw,
    XCircle,
    CheckCircle,
    CreditCard,
    Settings2,
} from "lucide-react";

import {
    AdminPage,
    AdminCard,
    StatCard,
    Button,
    SearchBar,
    StatusBadge,
    LoadingState,
    ErrorState,
    Table,
} from "../../../component/admin/AdminUI";

import { adminApi } from "../../../services/adminApi";
import SubscriptionPlans from "./SubscriptionPlans";

export default function Subscriptions() {

    const [subs, setSubs] =
        useState([]);

    const [q, setQ] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showPlans, setShowPlans] = useState(false);


    const load = async () => {

        setLoading(true);

        try {

            setSubs(
                await adminApi.subscriptions.list()
            );

            setError("");

        } catch (e) {

            setError(
                e.response?.data?.message ||
                    "Unable to load subscriptions."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        load();
    }, []);


    const act = async (fn) => {

        try {

            await fn();

            await load();

        } catch (e) {

            alert(
                e.response?.data?.message ||
                    "Operation failed."
            );

        }
    };


    const rows = subs.filter(
        (x) =>
            `${x.userName} ${x.userEmail} ${x.planName} ${x.planCode}`
                .toLowerCase()
                .includes(q.toLowerCase())
    );


    if (showPlans) {
        return <SubscriptionPlans onBack={() => setShowPlans(false)} />;
    }

    return (
        <AdminPage
            title="Subscription Management"
            subtitle="Monitor member subscriptions and their status"
            action={
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setShowPlans(true)}
                    >
                        <Settings2 size={13} className="inline mr-1" />
                        Manage Plans
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() =>
                            act(
                                adminApi
                                    .subscriptions
                                    .deactivateExpired
                            )
                        }
                    >
                        <RefreshCw
                            size={13}
                            className="inline mr-1"
                        />
                        Deactivate Expired
                    </Button>
                </div>
            }
        >

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">

                <StatCard
                    label="Subscriptions Returned"
                    value={subs.length}
                    icon={CreditCard}
                />

                <StatCard
                    label="Active"
                    value={
                        subs.filter(
                            (x) => x.isActive
                        ).length
                    }
                    tone="green"
                />

                <StatCard
                    label="Inactive / Expired"
                    value={
                        subs.filter(
                            (x) => !x.isActive
                        ).length
                    }
                    tone="orange"
                />

            </div>


            <AdminCard>

                <div className="p-4 border-b border-gray-100">

                    <SearchBar
                        value={q}
                        onChange={setQ}
                        placeholder="Search member or plan"
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
                                key: "userName",
                                label: "Member",
                                render: (r) => (
                                    <div>
                                        <p className="font-semibold">
                                            {r.userName}
                                        </p>

                                        <p className="text-[9px] text-gray-400">
                                            {r.userEmail}
                                        </p>
                                    </div>
                                ),
                            },

                            {
                                key: "planName",
                                label: "Plan",
                                render: (r) => (
                                    <span className="font-semibold text-purple-600">
                                        {r.planName ||
                                            r.planCode}
                                    </span>
                                ),
                            },

                            {
                                key: "price",
                                label: "Price",
                                render: (r) =>
                                    `${
                                        r.currency ||
                                        "INR"
                                    } ${
                                        r.price ??
                                        0
                                    }`,
                            },

                            {
                                key: "startDate",
                                label: "Start",
                            },

                            {
                                key: "endDate",
                                label: "End",
                            },

                            {
                                key: "isActive",
                                label: "Status",
                                render: (r) => (
                                    <StatusBadge
                                        value={
                                            r.isActive
                                                ? "ACTIVE"
                                                : "EXPIRED"
                                        }
                                    />
                                ),
                            },

                            {
                                key: "autoRenew",
                                label: "Auto Renew",
                                render: (r) =>
                                    r.autoRenew
                                        ? "Yes"
                                        : "No",
                            },

                            {
                                key: "actions",
                                label: "Actions",
                                render: (r) => (
                                    <div className="flex gap-2">

                                        {r.isActive && (
                                            <Button
                                                className="!h-7 !px-2"
                                                variant="danger"
                                                onClick={() => {

                                                    const reason =
                                                        window.prompt(
                                                            "Cancellation reason?"
                                                        ) ||
                                                        "";

                                                    act(
                                                        () =>
                                                            adminApi
                                                                .subscriptions
                                                                .cancel(
                                                                    r.id,
                                                                    reason
                                                                )
                                                    );

                                                }}
                                            >
                                                <XCircle
                                                    size={12}
                                                    className="inline mr-1"
                                                />
                                                Cancel
                                            </Button>
                                        )}


                                        {!r.isActive && (
                                            <Button
                                                className="!h-7 !px-2"
                                                variant="success"
                                                onClick={() => {

                                                    const paymentId =
                                                        window.prompt(
                                                            "Payment ID for activation?"
                                                        );

                                                    if (
                                                        paymentId
                                                    ) {
                                                        act(
                                                            () =>
                                                                adminApi
                                                                    .subscriptions
                                                                    .activate(
                                                                        r.id,
                                                                        Number(
                                                                            paymentId
                                                                        )
                                                                    )
                                                        );
                                                    }

                                                }}
                                            >
                                                <CheckCircle
                                                    size={12}
                                                    className="inline mr-1"
                                                />
                                                Activate
                                            </Button>
                                        )}

                                    </div>
                                ),
                            },
                        ]}
                        rows={rows}
                    />
                )}

            </AdminCard>

        </AdminPage>
    );
}