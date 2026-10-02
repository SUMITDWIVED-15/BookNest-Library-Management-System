import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BookOpen,
    CalendarDays,
    RotateCcw,
    Eye,
    CheckCircle2,
    Clock3,
    AlertTriangle,
    XCircle,
    Wrench,
} from "lucide-react";

import loanService from "../../services/loanService";

const tabs = [
    { id: "All", label: "All" },
    { id: "Active", label: "Active" },
    { id: "Overdue", label: "Overdue" },
    { id: "Returned", label: "Returned" },
    { id: "Lost", label: "Lost" },
    { id: "Damaged", label: "Damaged" },
];

function Loans() {
    const navigate = useNavigate();

    const [loans, setLoans] = useState([]);
    const [activeTab, setActiveTab] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] = useState(null);

    const loadLoans = async () => {
        try {
            setLoading(true);
            setError("");

            const status =
                activeTab === "All"
                    ? undefined
                    : activeTab === "Active"
                        ? "CHECKED_OUT"
                        : activeTab.toUpperCase();

            const response = await loanService.getMyLoans({
                status,
                page: 0,
                size: 20,
            });

            setLoans(response?.content || []);
        } catch (err) {
            console.error("Failed to load loans:", err);

            setLoans([]);

            setError(
                err?.response?.data?.message ||
                "Failed to load your borrowed books."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLoans();
    }, [activeTab]);

    const filteredLoans = useMemo(() => {
        return loans;
    }, [loans]);

    const handleRenew = async (loan) => {
        try {
            setActionLoading(`renew-${loan.id}`);
            setError("");

            await loanService.renewLoan({
                bookLoanId: loan.id,
                extensionDays: 14,
                notes: null,
            });

            await loadLoans();
        } catch (err) {
            console.error("Failed to renew loan:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to renew this book."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleReturn = async (loan) => {
        try {
            setActionLoading(`return-${loan.id}`);
            setError("");

            await loanService.checkinBook({
                bookLoanId: loan.id,
                condition: "RETURNED",
                notes: null,
            });

            await loadLoans();
        } catch (err) {
            console.error("Failed to return loan:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to return this book."
            );
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-full bg-gradient-to-br from-[#f4f6ff] via-white to-[#f8eaff] px-6 py-7 md:px-8">

            {/* ================= PAGE INTRO ================= */}

            <div className="mb-7">

                <h1 className="flex items-center gap-3 text-3xl font-bold text-[#171725]">

                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-[#8ee04f] to-[#6957e8]">
                        <BookOpen
                            size={24}
                            className="text-white"
                        />
                    </span>

                    <span>
                        My{" "}
                        <span className="text-[#6957e8]">
                            Borrowed Books
                        </span>
                    </span>

                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Manage your book loans, track due dates, and renew books
                </p>

            </div>


            {/* ================= STATUS TABS ================= */}

            <div className="mb-5 flex overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">

                {tabs.map((tab) => (

                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            relative min-w-[95px] px-5 py-3.5
                            text-sm font-medium transition
                            ${
                                activeTab === tab.id
                                    ? "text-[#6957e8]"
                                    : "text-gray-500 hover:text-gray-800"
                            }
                        `}
                    >

                        {tab.label}

                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-[#6957e8]" />
                        )}

                    </button>

                ))}

            </div>


            {/* ================= ERROR ================= */}

            {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}


            {/* ================= LOADING ================= */}

            {loading ? (

                <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                    <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#6957e8]" />

                    <p className="text-sm text-gray-500">
                        Loading your borrowed books...
                    </p>

                </div>

            ) : (

                /* ================= LOANS ================= */

                <div className="space-y-5">

                    {filteredLoans.length > 0 ? (

                        filteredLoans.map((loan) => (
                            <LoanCard
                                key={loan.id}
                                loan={loan}
                                navigate={navigate}
                                onRenew={handleRenew}
                                onReturn={handleReturn}
                                actionLoading={actionLoading}
                            />
                        ))

                    ) : (

                        <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                            <BookOpen
                                size={42}
                                className="mx-auto mb-3 text-gray-300"
                            />

                            <h3 className="font-semibold text-gray-700">
                                No books found
                            </h3>

                            <p className="mt-1 text-sm text-gray-400">
                                There are no books in this category.
                            </p>

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}


/* ============================================================
   LOAN CARD
============================================================ */

function LoanCard({
    loan,
    navigate,
    onRenew,
    onReturn,
    actionLoading,
}) {

    const statusMap = {
        CHECKED_OUT: "Active",
        RETURNED: "Returned",
        OVERDUE: "Overdue",
        LOST: "Lost",
        DAMAGED: "Damaged",
    };

    const displayStatus =
        statusMap[loan.status] || loan.status || "Active";


    const statusConfig = {
        Active: {
            label: "Checked Out",
            icon: CheckCircle2,
            className: "bg-[#dff0ff] text-[#1680d8]",
            topClass: "bg-[#e8f4ff]",
        },

        Overdue: {
            label: "Overdue",
            icon: AlertTriangle,
            className: "bg-[#fff0df] text-[#e58b00]",
            topClass: "bg-[#fff4e6]",
        },

        Returned: {
            label: "Returned",
            icon: CheckCircle2,
            className: "bg-[#dff8ed] text-[#19a86b]",
            topClass: "bg-[#e7faf2]",
        },

        Lost: {
            label: "Lost",
            icon: XCircle,
            className: "bg-[#ffe5e5] text-[#dc3c3c]",
            topClass: "bg-[#fff0f0]",
        },

        Damaged: {
            label: "Damaged",
            icon: Wrench,
            className: "bg-[#fff0d9] text-[#d78b00]",
            topClass: "bg-[#fff7e8]",
        },
    };

    const config =
        statusConfig[displayStatus] || statusConfig.Active;

    const StatusIcon = config.icon;


    const renewalCount = loan.renewalCount ?? 0;
    const maxRenewals = loan.maxRenewals ?? 0;

    const canRenew =
        displayStatus === "Active" &&
        renewalCount < maxRenewals;


    const renewalPercentage =
        maxRenewals > 0
            ? Math.min(
                (renewalCount / maxRenewals) * 100,
                100
            )
            : 0;


    const checkoutDate = formatDate(loan.checkoutDate);
    const dueDate = formatDate(loan.dueDate);
    const returnDate = formatDate(loan.returnDate);


    return (

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">

            {/* ================= STATUS HEADER ================= */}

            <div className={`px-5 py-3 ${config.topClass}`}>

                <span
                    className={`
                        inline-flex items-center gap-1.5
                        rounded-full px-3 py-1
                        text-xs font-semibold
                        ${config.className}
                    `}
                >
                    <StatusIcon size={13} />
                    {config.label}
                </span>

            </div>


            {/* ================= MAIN CONTENT ================= */}

            <div className="p-5">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">


                    {/* ================= BOOK ================= */}

                    <div className="flex min-w-0 flex-1 gap-4">

                        <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-[#eeeafd] shadow-sm">

                            {loan.bookCoverImage ? (

                                <img
                                    src={loan.bookCoverImage}
                                    alt={loan.bookTitle || "Book cover"}
                                    className="h-full w-full object-cover"
                                    onError={(event) => {
                                        event.currentTarget.style.display = "none";
                                    }}
                                />

                            ) : (

                                <div className="flex h-full w-full items-center justify-center">
                                    <BookOpen
                                        size={24}
                                        className="text-[#6957e8]"
                                    />
                                </div>

                            )}

                        </div>


                        <div className="min-w-0">

                            <h2 className="text-lg font-semibold text-[#171725]">
                                {loan.bookTitle || "Untitled Book"}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                <span className="mr-1">♟</span>
                                {loan.bookAuthor || "Unknown Author"}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                # ISBN: {loan.bookIsbn || "-"}
                            </p>

                        </div>

                    </div>


                    {/* ================= DATES ================= */}

                    <div className="grid grid-cols-2 gap-8 lg:w-[360px]">

                        <div>

                            <p className="text-xs text-gray-400">
                                Checkout Date
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-700">

                                <CalendarDays
                                    size={14}
                                    className="text-gray-500"
                                />

                                {checkoutDate}

                            </p>

                        </div>


                        <div>

                            <p className="text-xs text-gray-400">
                                Due Date
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-700">

                                <CalendarDays
                                    size={14}
                                    className="text-gray-500"
                                />

                                {dueDate}

                            </p>

                        </div>


                        <div className="col-span-2">

                            <div className="flex items-center justify-between">

                                <p className="text-xs text-gray-400">
                                    Renewals
                                </p>

                                <span className="text-xs font-medium text-gray-500">
                                    {renewalCount} / {maxRenewals}
                                </span>

                            </div>


                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">

                                <div
                                    className="h-full rounded-full bg-[#6957e8]"
                                    style={{
                                        width: `${renewalPercentage}%`,
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= NOTE ================= */}

                {loan.notes && (

                    <div className="mt-5 rounded-lg border border-gray-200 bg-[#f7faff] px-4 py-3">

                        <p className="text-sm text-gray-500">

                            <span className="italic">
                                Note:
                            </span>{" "}

                            {loan.notes}

                        </p>

                    </div>

                )}


                {/* ================= RETURN INFO ================= */}

                {displayStatus === "Returned" && loan.returnDate && (

                    <div className="mt-5 rounded-lg border border-green-100 bg-[#f7fcf9] px-4 py-3">

                        <p className="text-sm text-gray-500">

                            <span className="font-medium text-gray-600">
                                Returned on:
                            </span>{" "}

                            {returnDate}

                        </p>

                    </div>

                )}


                {/* ================= OVERDUE INFO ================= */}

                {displayStatus === "Overdue" && (

                    <div className="mt-5 rounded-lg border border-orange-100 bg-[#fffaf3] px-4 py-3">

                        <p className="text-sm text-gray-500">

                            <span className="font-medium text-[#d98200]">
                                Overdue by:
                            </span>{" "}

                            {loan.overdueDays ?? 0} day(s)

                        </p>

                    </div>

                )}


                {/* ================= ACTIONS ================= */}

                <div className="mt-5 flex flex-wrap justify-end gap-3">

                    <button
                        type="button"
                        onClick={() => navigate(`/books/${loan.bookId}`)}
                        className="inline-flex items-center gap-2 rounded-md border border-[#b7bce0] bg-white px-4 py-2 text-xs font-medium text-[#5861a8] transition hover:bg-[#f4f3ff]"
                    >
                        <Eye size={14} />
                        View Book Details
                    </button>


                    {displayStatus === "Active" && (

                        <button
                            type="button"
                            disabled={!canRenew || actionLoading === `renew-${loan.id}`}
                            onClick={() => onRenew(loan)}
                            className={`
                                inline-flex items-center gap-2 rounded-md
                                px-4 py-2 text-xs font-semibold transition
                                ${
                                    canRenew
                                        ? "bg-[#e5f8ef] text-[#19a86b] hover:bg-[#d5f3e5]"
                                        : "cursor-not-allowed bg-gray-100 text-gray-400"
                                }
                            `}
                        >

                            <RotateCcw
                                size={14}
                                className={
                                    actionLoading === `renew-${loan.id}`
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            {actionLoading === `renew-${loan.id}`
                                ? "Renewing..."
                                : "Renew Book"}

                        </button>

                    )}


                    {displayStatus === "Overdue" && (

                        <button
                            type="button"
                            disabled={actionLoading === `return-${loan.id}`}
                            onClick={() => onReturn(loan)}
                            className="inline-flex items-center gap-2 rounded-md bg-[#fff0e0] px-4 py-2 text-xs font-semibold text-[#d98200] transition hover:bg-[#ffe5c7] disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            <Clock3 size={14} />

                            {actionLoading === `return-${loan.id}`
                                ? "Returning..."
                                : "Return Now"}

                        </button>

                    )}

                </div>

            </div>

        </div>
    );
}


/* ============================================================
   DATE FORMATTER
============================================================ */

function formatDate(date) {

    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}


export default Loans;