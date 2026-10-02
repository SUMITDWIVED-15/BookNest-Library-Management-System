import { useEffect, useState } from "react";

import {
    BookMarked,
    RefreshCw,
    Search,
    Plus,
    CheckCircle,
    RotateCcw,
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
    "CHECKED_OUT",
    "RETURNED",
    "OVERDUE",
    "LOST",
    "DAMAGED",
];

export default function Loans() {

    const [data, setData] = useState({
        content: [],
        totalPages: 1,
        totalElements: 0,
    });

    const [page, setPage] = useState(0);

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

    const [overdueOnly, setOverdueOnly] =
        useState(false);

    const [modal, setModal] =
        useState(null);

    const [users, setUsers] =
        useState([]);

    const [checkout, setCheckout] =
        useState({
            userId: "",
            bookId: "",
            checkoutDays: 14,
            notes: "",
        });

    const [checkin, setCheckin] =
        useState({
            bookLoanId: "",
            condition: "RETURNED",
            notes: "",
        });

    const [renew, setRenew] =
        useState({
            bookLoanId: "",
            extensionDays: 14,
            notes: "",
        });


    const load = async () => {

        setLoading(true);
        setError("");

        try {

            const r =
                await adminApi.loans.search({
                    userId: userId
                        ? Number(userId)
                        : null,

                    bookId: bookId
                        ? Number(bookId)
                        : null,

                    status: status || null,

                    overdueOnly,

                    page,

                    size: 10,

                    sortBy: "createdAt",

                    sortDirection: "DESC",
                });

            setData(r);

        } catch (e) {

            setError(
                e.response?.data?.message ||
                    "Unable to load loans."
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
            title="Book Loans"
            subtitle="Manage checkout, return, renewal and overdue circulation"
            action={
                <div className="flex gap-2">

                    <Button
                        variant="secondary"
                        onClick={async () => {

                            try {

                                await adminApi.loans.updateOverdue();

                                await load();

                            } catch (e) {

                                alert(
                                    e.response?.data?.message ||
                                        "Update failed."
                                );

                            }

                        }}
                    >
                        <RefreshCw
                            size={13}
                            className="inline mr-1"
                        />
                        Update Overdue
                    </Button>

                    <Button
                        onClick={() =>
                            setModal("checkout")
                        }
                    >
                        <Plus
                            size={13}
                            className="inline mr-1"
                        />
                        Checkout
                    </Button>

                </div>
            }
        >

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">

                <StatCard
                    label="Loan Records"
                    value={data.totalElements}
                    icon={BookMarked}
                />

                <StatCard
                    label="Current Page"
                    value={data.content.length}
                    tone="blue"
                />

                <StatCard
                    label="Overdue Shown"
                    value={
                        data.content.filter(
                            (x) => x.isOverdue
                        ).length
                    }
                    tone="orange"
                />

            </div>


            <AdminCard>

                <div className="p-4 border-b border-gray-100 flex flex-wrap gap-2 items-end">

                    <Field
                        label="User ID"
                        value={userId}
                        onChange={(v) => {
                            setUserId(v);
                            setPage(0);
                        }}
                        type="number"
                    />

                    <Field
                        label="Book ID"
                        value={bookId}
                        onChange={(v) => {
                            setBookId(v);
                            setPage(0);
                        }}
                        type="number"
                    />

                    <SelectField
                        label="Status"
                        value={status}
                        onChange={(v) => {
                            setStatus(v);
                            setPage(0);
                        }}
                        options={statuses.map((x) => ({
                            value: x,
                            label: x,
                        }))}
                    />

                    <label className="h-10 flex items-center gap-2 px-3 text-[10px] text-gray-600 border border-gray-200 rounded-lg">

                        <input
                            type="checkbox"
                            checked={overdueOnly}
                            onChange={(e) => {
                                setOverdueOnly(
                                    e.target.checked
                                );
                                setPage(0);
                            }}
                        />

                        Overdue only

                    </label>

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
                                label: "Loan #",
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
                                key: "checkoutDate",
                                label: "Checkout",
                            },

                            {
                                key: "dueDate",
                                label: "Due",
                            },

                            {
                                key: "isOverdue",
                                label: "Overdue",
                                render: (r) =>
                                    r.isOverdue ? (
                                        <StatusBadge
                                            value={`OVERDUE ${
                                                r.overdueDays ||
                                                0
                                            }d`}
                                        />
                                    ) : (
                                        <StatusBadge value="NO" />
                                    ),
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

                                        <button
                                            title="Check in"
                                            className="text-green-600"
                                            onClick={() => {
                                                setCheckin({
                                                    bookLoanId:
                                                        r.id,
                                                    condition:
                                                        "RETURNED",
                                                    notes: "",
                                                });

                                                setModal(
                                                    "checkin"
                                                );
                                            }}
                                        >
                                            <CheckCircle
                                                size={14}
                                            />
                                        </button>

                                        <button
                                            title="Renew"
                                            className="text-purple-600"
                                            onClick={() => {
                                                setRenew({
                                                    bookLoanId:
                                                        r.id,
                                                    extensionDays:
                                                        14,
                                                    notes: "",
                                                });

                                                setModal(
                                                    "renew"
                                                );
                                            }}
                                        >
                                            <RotateCcw
                                                size={14}
                                            />
                                        </button>

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
                open={modal === "checkout"}
                onClose={() => setModal(null)}
                title="Checkout Book"
            >

                <form
                    className="grid gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();

                        action(() =>
                            adminApi.loans.checkout(
                                Number(
                                    checkout.userId
                                ),
                                {
                                    bookId: Number(
                                        checkout.bookId
                                    ),
                                    checkoutDays:
                                        Number(
                                            checkout.checkoutDays
                                        ),
                                    notes:
                                        checkout.notes,
                                }
                            )
                        );
                    }}
                >

                    <SelectField
                        label="User"
                        required
                        value={checkout.userId}
                        onChange={(v) =>
                            setCheckout({
                                ...checkout,
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
                        value={checkout.bookId}
                        onChange={(v) =>
                            setCheckout({
                                ...checkout,
                                bookId: v,
                            })
                        }
                    />

                    <Field
                        label="Checkout Days"
                        type="number"
                        value={
                            checkout.checkoutDays
                        }
                        onChange={(v) =>
                            setCheckout({
                                ...checkout,
                                checkoutDays: v,
                            })
                        }
                    />

                    <Field
                        label="Notes"
                        value={checkout.notes}
                        onChange={(v) =>
                            setCheckout({
                                ...checkout,
                                notes: v,
                            })
                        }
                    />

                    <div className="flex justify-end">
                        <Button type="submit">
                            Checkout
                        </Button>
                    </div>

                </form>

            </Modal>


            <Modal
                open={modal === "checkin"}
                onClose={() => setModal(null)}
                title="Check In Book"
            >

                <form
                    className="grid gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();

                        action(() =>
                            adminApi.loans.checkin({
                                bookLoanId: Number(
                                    checkin.bookLoanId
                                ),
                                condition:
                                    checkin.condition,
                                notes:
                                    checkin.notes,
                            })
                        );
                    }}
                >

                    <Field
                        label="Loan ID"
                        required
                        type="number"
                        value={
                            checkin.bookLoanId
                        }
                        onChange={(v) =>
                            setCheckin({
                                ...checkin,
                                bookLoanId: v,
                            })
                        }
                    />

                    <SelectField
                        label="Condition / Status"
                        value={
                            checkin.condition
                        }
                        onChange={(v) =>
                            setCheckin({
                                ...checkin,
                                condition: v,
                            })
                        }
                        options={[
                            "RETURNED",
                            "DAMAGED",
                            "LOST",
                        ].map((x) => ({
                            value: x,
                            label: x,
                        }))}
                    />

                    <Field
                        label="Notes"
                        value={checkin.notes}
                        onChange={(v) =>
                            setCheckin({
                                ...checkin,
                                notes: v,
                            })
                        }
                    />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="success"
                        >
                            Check In
                        </Button>
                    </div>

                </form>

            </Modal>


            <Modal
                open={modal === "renew"}
                onClose={() => setModal(null)}
                title="Renew Loan"
            >

                <form
                    className="grid gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();

                        action(() =>
                            adminApi.loans.renew({
                                bookLoanId: Number(
                                    renew.bookLoanId
                                ),
                                extensionDays:
                                    Number(
                                        renew.extensionDays
                                    ),
                                notes:
                                    renew.notes,
                            })
                        );
                    }}
                >

                    <Field
                        label="Loan ID"
                        required
                        type="number"
                        value={
                            renew.bookLoanId
                        }
                        onChange={(v) =>
                            setRenew({
                                ...renew,
                                bookLoanId: v,
                            })
                        }
                    />

                    <Field
                        label="Extension Days"
                        type="number"
                        value={
                            renew.extensionDays
                        }
                        onChange={(v) =>
                            setRenew({
                                ...renew,
                                extensionDays: v,
                            })
                        }
                    />

                    <Field
                        label="Notes"
                        value={renew.notes}
                        onChange={(v) =>
                            setRenew({
                                ...renew,
                                notes: v,
                            })
                        }
                    />

                    <div className="flex justify-end">
                        <Button type="submit">
                            Renew
                        </Button>
                    </div>

                </form>

            </Modal>

        </AdminPage>
    );
}