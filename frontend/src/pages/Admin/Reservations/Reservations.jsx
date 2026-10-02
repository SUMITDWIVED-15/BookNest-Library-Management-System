import { useEffect, useState } from "react";

import {
    Plus,
    RefreshCw,
    Search,
    CheckCircle,
    XCircle,
    CalendarCheck,
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
} from "../../../component/admin/AdminUI";

import { adminApi } from "../../../services/adminApi";

const statuses = [
    "PENDING",
    "AVAILABLE",
    "FULFILLED",
    "CANCELLED",
    "EXPIRED",
];

export default function Reservations() {

    const [data, setData] = useState({
        content: [],
        totalPages: 1,
        totalElements: 0,
    });

    const [page, setPage] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [userId, setUserId] =
        useState("");

    const [bookId, setBookId] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [activeOnly, setActiveOnly] =
        useState("");

    const [users, setUsers] =
        useState([]);

    const [modal, setModal] =
        useState(null);

    const [form, setForm] =
        useState({
            userId: "",
            bookId: "",
            notes: "",
        });


    const load = async () => {

        setLoading(true);

        try {

            setData(
                await adminApi.reservations.list({
                    userId:
                        userId
                            ? Number(userId)
                            : null,

                    bookId:
                        bookId
                            ? Number(bookId)
                            : null,

                    status:
                        status || null,

                    activeOnly:
                        activeOnly === ""
                            ? null
                            : activeOnly ===
                              "true",

                    page,

                    size: 10,

                    sortBy:
                        "reservedAt",

                    sortDirection:
                        "DESC",
                })
            );

            setError("");

        } catch (e) {

            setError(
                e.response?.data?.message ||
                    "Unable to load reservations."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        load();
    }, [page]);


    useEffect(() => {

        adminApi.users
            .list()
            .then(setUsers)
            .catch(() => {});

    }, []);


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
            title="Reservation Management"
            subtitle="Monitor and process book reservations"
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
                        Create Reservation
                    </Button>

                </div>
            }
        >

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">

                <StatCard
                    label="Reservations"
                    value={data.totalElements}
                    icon={CalendarCheck}
                />

                <StatCard
                    label="Pending / Available"
                    value={
                        data.content.filter(
                            (x) =>
                                [
                                    "PENDING",
                                    "AVAILABLE",
                                ].includes(
                                    x.status
                                )
                        ).length
                    }
                    tone="orange"
                />

                <StatCard
                    label="Fulfilled"
                    value={
                        data.content.filter(
                            (x) =>
                                x.status ===
                                "FULFILLED"
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

                    <Field
                        label="Book ID"
                        type="number"
                        value={bookId}
                        onChange={(v) => {
                            setBookId(v);
                            setPage(0);
                        }}
                    />

                    <SelectField
                        label="Status"
                        value={status}
                        onChange={(v) => {
                            setStatus(v);
                            setPage(0);
                        }}
                        options={statuses.map(
                            (x) => ({
                                value: x,
                                label: x,
                            })
                        )}
                    />

                    <SelectField
                        label="Active Only"
                        value={activeOnly}
                        onChange={(v) => {
                            setActiveOnly(v);
                            setPage(0);
                        }}
                        options={[
                            {
                                value: "true",
                                label: "Yes",
                            },
                            {
                                value: "false",
                                label: "No",
                            },
                        ]}
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
                                label: "#",
                            },

                            {
                                key: "bookTitle",
                                label: "Book",
                                render: (r) => (
                                    <div>
                                        <p className="font-semibold">
                                            {r.bookTitle}
                                        </p>

                                        <p className="text-[9px] text-gray-400">
                                            {r.bookIsbn}
                                        </p>
                                    </div>
                                ),
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
                                key: "reservedAt",
                                label: "Reserved",
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
                                key: "isBookAvailable",
                                label: "Book",
                                render: (r) =>
                                    r.isBookAvailable ? (
                                        <StatusBadge
                                            value="AVAILABLE"
                                        />
                                    ) : (
                                        <StatusBadge
                                            value="UNAVAILABLE"
                                        />
                                    ),
                            },

                            {
                                key: "actions",
                                label: "Actions",
                                render: (r) => (
                                    <div className="flex gap-2">

                                        {[
                                            "PENDING",
                                            "AVAILABLE",
                                        ].includes(
                                            r.status
                                        ) && (
                                            <button
                                                title="Fulfill"
                                                className="text-green-600"
                                                onClick={() =>
                                                    action(
                                                        () =>
                                                            adminApi
                                                                .reservations
                                                                .fulfill(
                                                                    r.id
                                                                )
                                                    )
                                                }
                                            >
                                                <CheckCircle
                                                    size={
                                                        14
                                                    }
                                                />
                                            </button>
                                        )}

                                        {[
                                            "PENDING",
                                            "AVAILABLE",
                                        ].includes(
                                            r.status
                                        ) && (
                                            <button
                                                title="Cancel"
                                                className="text-red-500"
                                                onClick={() =>
                                                    action(
                                                        () =>
                                                            adminApi
                                                                .reservations
                                                                .cancel(
                                                                    r.id
                                                                )
                                                    )
                                                }
                                            >
                                                <XCircle
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
                title="Create Reservation"
            >

                <form
                    className="grid gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();

                        action(() =>
                            adminApi.reservations.createForUser(
                                Number(
                                    form.userId
                                ),
                                {
                                    bookId:
                                        Number(
                                            form.bookId
                                        ),
                                    notes:
                                        form.notes,
                                }
                            )
                        );
                    }}
                >

                    <SelectField
                        label="User"
                        required
                        value={form.userId}
                        onChange={(v) =>
                            setForm({
                                ...form,
                                userId: v,
                            })
                        }
                        options={users.map(
                            (u) => ({
                                value: u.id,
                                label: `${u.fullName} — ${u.email}`,
                            })
                        )}
                    />

                    <Field
                        label="Book ID"
                        required
                        type="number"
                        value={form.bookId}
                        onChange={(v) =>
                            setForm({
                                ...form,
                                bookId: v,
                            })
                        }
                    />

                    <Field
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
                            Create Reservation
                        </Button>

                    </div>

                </form>

            </Modal>

        </AdminPage>
    );
}