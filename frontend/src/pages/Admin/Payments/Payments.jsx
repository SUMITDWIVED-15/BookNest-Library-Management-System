import { useEffect, useState } from "react";

import {
    RefreshCw,
    WalletCards,
    Search,
} from "lucide-react";

import {
    AdminPage,
    AdminCard,
    StatCard,
    Button,
    SelectField,
    StatusBadge,
    Pagination,
    LoadingState,
    ErrorState,
    Table,
} from "../../../component/admin/AdminUI";

import { adminApi } from "../../../services/adminApi";

const statuses = [
    "PENDING",
    "SUCCESS",
    "FAILED",
    "CANCELLED",
    "REFUNDED",
];

const types = [
    "FINE",
    "MEMBERSHIP",
    "LOST_BOOK_PENALTY",
    "DAMAGED_BOOK_PENALTY",
    "REFUND",
];

export default function Payments() {

    const [data, setData] = useState({
        content: [],
        totalPages: 1,
        totalElements: 0,
    });

    const [page, setPage] =
        useState(0);

    const [status, setStatus] =
        useState("");

    const [type, setType] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const load = async () => {

        setLoading(true);

        try {

            setData(
                await adminApi.payments.list({
                    page,
                    size: 10,
                    sortBy:
                        "createdAt",
                    sortDir:
                        "DESC",
                })
            );

            setError("");

        } catch (e) {

            setError(
                e.response?.data?.message ||
                    "Unable to load payments."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        load();
    }, [page]);


    const rows =
        data.content.filter(
            (p) =>
                (!status ||
                    p.status ===
                        status) &&
                (!type ||
                    p.paymentType ===
                        type)
        );


    return (
        <AdminPage
            title="Payment Management"
            subtitle="Review payment transactions returned by the payment service"
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
                    label="Payment Records"
                    value={data.totalElements}
                    icon={WalletCards}
                />

                <StatCard
                    label="Successful on Page"
                    value={
                        data.content.filter(
                            (x) =>
                                x.status ===
                                "SUCCESS"
                        ).length
                    }
                    tone="green"
                />

                <StatCard
                    label="Failed on Page"
                    value={
                        data.content.filter(
                            (x) =>
                                x.status ===
                                "FAILED"
                        ).length
                    }
                    tone="red"
                />

            </div>


            <AdminCard>

                <div className="p-4 border-b border-gray-100 flex flex-wrap gap-2 items-end">

                    <SelectField
                        label="Status"
                        value={status}
                        onChange={setStatus}
                        options={statuses.map(
                            (x) => ({
                                value: x,
                                label: x,
                            })
                        )}
                    />

                    <SelectField
                        label="Payment Type"
                        value={type}
                        onChange={setType}
                        options={types.map(
                            (x) => ({
                                value: x,
                                label: x,
                            })
                        )}
                    />

                    <Button
                        variant="secondary"
                        onClick={() => {
                            setPage(0);
                            load();
                        }}
                    >
                        <Search
                            size={13}
                            className="inline mr-1"
                        />
                        Filter
                    </Button>

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
                                key: "transactionId",
                                label: "Transaction",
                                render: (r) => (
                                    <div>

                                        <p className="font-semibold">
                                            {r.transactionId ||
                                                "—"}
                                        </p>

                                        <p className="text-[9px] text-gray-400">
                                            {r.gatewayPaymentId ||
                                                ""}
                                        </p>

                                    </div>
                                ),
                            },

                            {
                                key: "userName",
                                label: "Member",
                                render: (r) => (
                                    <div>

                                        <p>
                                            {r.userName}
                                        </p>

                                        <p className="text-[9px] text-gray-400">
                                            {r.userEmail}
                                        </p>

                                    </div>
                                ),
                            },

                            {
                                key: "paymentType",
                                label: "Type",
                            },

                            {
                                key: "amount",
                                label: "Amount",
                                render: (r) =>
                                    `${
                                        r.currency ||
                                        "INR"
                                    } ${
                                        r.amount ??
                                        0
                                    }`,
                            },

                            {
                                key: "gateway",
                                label: "Gateway",
                            },

                            {
                                key: "paymentMethod",
                                label: "Method",
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

                            {
                                key: "createdAt",
                                label: "Created",
                            },
                        ]}
                        rows={rows}
                    />
                )}

            </AdminCard>


            <Pagination
                page={page}
                totalPages={data.totalPages}
                onChange={setPage}
            />

        </AdminPage>
    );
}