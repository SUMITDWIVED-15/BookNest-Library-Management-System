import { useEffect, useState } from "react";

import {
    Plus,
    RefreshCw,
    Search,
    DollarSign,
    Ban,
    CheckCircle,
} from "lucide-react";

import {
    AdminPage,
    AdminCard,
    StatCard,
    Button,
    Modal,
    Field,
    SelectField,
    StatusBadge,
    Pagination,
    LoadingState,
    ErrorState,
    Table,
    TextAreaField,
} from "../../../component/admin/AdminUI";

import { adminApi } from "../../../services/adminApi";

const fineTypes = [
    "OVERDUE",
    "DAMAGE",
    "LOSS",
    "PROCESSING",
];

const fineStatuses = [
    "PENDING",
    "PARTIALLY_PAID",
    "PAID",
    "WAIVED",
];

export default function Fines() {

    const [data, setData] = useState({
        content: [],
        totalPages: 1,
        totalElements: 0,
    });

    const [page, setPage] = useState(0);

    const [status, setStatus] =
        useState("");

    const [type, setType] =
        useState("");

    const [userId, setUserId] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [modal, setModal] =
        useState(null);

    const [form, setForm] =
        useState({
            bookLoanId: "",
            type: "OVERDUE",
            amount: "",
            reason: "",
            notes: "",
        });

    const [waive, setWaive] =
        useState({
            fineId: "",
            reason: "",
        });

    const [payId, setPayId] =
        useState("");

    const [transactionId, setTransactionId] =
        useState("");


    const load = async () => {

        setLoading(true);

        try {

            setData(
                await adminApi.fines.list({
                    status:
                        status || null,

                    type:
                        type || null,

                    userId:
                        userId
                            ? Number(userId)
                            : null,

                    page,
                    size: 10,
                })
            );

            setError("");

        } catch (e) {

            setError(
                e.response?.data?.message ||
                    "Unable to load fines."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        load();
    }, [page]);


    const action = async (fn) => {

        try {

            await fn();

            setModal(null);

            await load();

        } catch (e) {

            alert(
                e.response?.data?.message ||
                    "Operation failed."
            );

        }
    };


    return (
        <AdminPage
            title="Fine Management"
            subtitle="Manage overdue, damage, loss and processing fines"
            action={
                <div className="flex gap-2">

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

                    <Button
                        onClick={() =>
                            setModal("create")
                        }
                    >
                        <Plus
                            size={13}
                            className="inline mr-1"
                        />
                        Create Fine
                    </Button>

                </div>
            }
        >

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">

                <StatCard
                    label="Fine Records"
                    value={data.totalElements}
                    icon={DollarSign}
                />

                <StatCard
                    label="Pending on Page"
                    value={
                        data.content.filter(
                            (x) =>
                                x.status ===
                                "PENDING"
                        ).length
                    }
                    tone="orange"
                />

                <StatCard
                    label="Paid on Page"
                    value={
                        data.content.filter(
                            (x) =>
                                x.status ===
                                "PAID"
                        ).length
                    }
                    tone="green"
                />

            </div>


            <AdminCard>

                <div className="p-4 border-b border-gray-100 flex flex-wrap gap-2 items-end">

                    <Field
                        label="User ID"
                        type="number"
                        value={userId}
                        onChange={(v) => {
                            setUserId(v);
                            setPage(0);
                        }}
                    />

                    <SelectField
                        label="Type"
                        value={type}
                        onChange={(v) => {
                            setType(v);
                            setPage(0);
                        }}
                        options={fineTypes.map(
                            (x) => ({
                                value: x,
                                label: x,
                            })
                        )}
                    />

                    <SelectField
                        label="Status"
                        value={status}
                        onChange={(v) => {
                            setStatus(v);
                            setPage(0);
                        }}
                        options={fineStatuses.map(
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
                        Search
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
                                label: "Fine #",
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
                                key: "bookTitle",
                                label: "Book",
                            },

                            {
                                key: "type",
                                label: "Type",
                                render: (r) => (
                                    <StatusBadge
                                        value={r.type}
                                    />
                                ),
                            },

                            {
                                key: "amount",
                                label: "Amount",
                                render: (r) =>
                                    `₹${
                                        r.amount ??
                                        0
                                    }`,
                            },

                            {
                                key: "amountOutstanding",
                                label: "Outstanding",
                                render: (r) =>
                                    `₹${
                                        r.amountOutstanding ??
                                        0
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

                            {
                                key: "actions",
                                label: "Actions",
                                render: (r) => (
                                    <div className="flex gap-2">

                                        {r.status !==
                                            "PAID" &&
                                            r.status !==
                                                "WAIVED" && (
                                                <button
                                                    title="Pay"
                                                    className="text-green-600"
                                                    onClick={() => {
                                                        setPayId(
                                                            r.id
                                                        );

                                                        setTransactionId(
                                                            ""
                                                        );

                                                        setModal(
                                                            "pay"
                                                        );
                                                    }}
                                                >
                                                    <CheckCircle
                                                        size={
                                                            14
                                                        }
                                                    />
                                                </button>
                                            )}

                                        {r.status !==
                                            "WAIVED" &&
                                            r.status !==
                                                "PAID" && (
                                                <button
                                                    title="Waive"
                                                    className="text-red-500"
                                                    onClick={() => {
                                                        setWaive(
                                                            {
                                                                fineId:
                                                                    r.id,
                                                                reason:
                                                                    "",
                                                            }
                                                        );

                                                        setModal(
                                                            "waive"
                                                        );
                                                    }}
                                                >
                                                    <Ban
                                                        size={
                                                            14
                                                        }
                                                    />
                                                </button>
                                            )}

                                    </div>
                                ),
                            },
                        ]}
                        rows={data.content}
                    />
                )}


                <Pagination
                    page={page}
                    totalPages={data.totalPages}
                    onChange={setPage}
                />

            </AdminCard>


            <Modal
                open={modal === "create"}
                onClose={() => setModal(null)}
                title="Create Fine"
            >

                <form
                    className="grid gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();

                        action(() =>
                            adminApi.fines.create({
                                bookLoanId:
                                    Number(
                                        form.bookLoanId
                                    ),
                                type: form.type,
                                amount:
                                    Number(
                                        form.amount
                                    ),
                                reason:
                                    form.reason,
                                notes:
                                    form.notes,
                            })
                        );
                    }}
                >

                    <Field
                        label="Book Loan ID"
                        required
                        type="number"
                        value={
                            form.bookLoanId
                        }
                        onChange={(v) =>
                            setForm({
                                ...form,
                                bookLoanId: v,
                            })
                        }
                    />

                    <SelectField
                        label="Fine Type"
                        required
                        value={form.type}
                        onChange={(v) =>
                            setForm({
                                ...form,
                                type: v,
                            })
                        }
                        options={fineTypes.map(
                            (x) => ({
                                value: x,
                                label: x,
                            })
                        )}
                    />

                    <Field
                        label="Amount"
                        required
                        type="number"
                        value={form.amount}
                        onChange={(v) =>
                            setForm({
                                ...form,
                                amount: v,
                            })
                        }
                    />

                    <Field
                        label="Reason"
                        value={form.reason}
                        onChange={(v) =>
                            setForm({
                                ...form,
                                reason: v,
                            })
                        }
                    />

                    <TextAreaField
                        label="Notes"
                        value={form.notes}
                        onChange={(v) =>
                            setForm({
                                ...form,
                                notes: v,
                            })
                        }
                    />

                    <div className="flex justify-end">
                        <Button type="submit">
                            Create Fine
                        </Button>
                    </div>

                </form>

            </Modal>


            <Modal
                open={modal === "pay"}
                onClose={() => setModal(null)}
                title="Pay Fine"
            >

                <form
                    className="grid gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();

                        action(() =>
                            adminApi.fines.pay(
                                payId,
                                transactionId
                            )
                        );
                    }}
                >

                    <Field
                        label="Fine ID"
                        value={payId}
                    />

                    <Field
                        label="Transaction ID (optional)"
                        value={transactionId}
                        onChange={
                            setTransactionId
                        }
                    />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="success"
                        >
                            Pay Fine
                        </Button>
                    </div>

                </form>

            </Modal>


            <Modal
                open={modal === "waive"}
                onClose={() => setModal(null)}
                title="Waive Fine"
            >

                <form
                    className="grid gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();

                        action(() =>
                            adminApi.fines.waive(
                                waive
                            )
                        );
                    }}
                >

                    <Field
                        label="Fine ID"
                        value={waive.fineId}
                    />

                    <TextAreaField
                        label="Waiver Reason"
                        value={waive.reason}
                        onChange={(v) =>
                            setWaive({
                                ...waive,
                                reason: v,
                            })
                        }
                    />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="danger"
                        >
                            Waive Fine
                        </Button>
                    </div>

                </form>

            </Modal>

        </AdminPage>
    );
}