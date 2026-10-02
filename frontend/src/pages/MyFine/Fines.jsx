import { useEffect, useMemo, useState } from "react";

import {
    Filter,
    ChevronDown,
    Receipt,
    CheckCircle2,
    AlertTriangle,
    CalendarDays,
    IndianRupee,
} from "lucide-react";

import fineService from "../../services/fineService";


function Fines() {

    const [statusFilter, setStatusFilter] = useState("All Status");
    const [typeFilter, setTypeFilter] = useState("All Types");

    const [fines, setFines] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [payingFineId, setPayingFineId] = useState(null);


    /* ============================================================
       LOAD MY FINES
    ============================================================ */

    const loadFines = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fineService.getMyFines();

            setFines(Array.isArray(response) ? response : []);

        } catch (err) {

            console.error("Failed to load fines:", err);

            setFines([]);

            setError(
                err?.response?.data?.message ||
                "Failed to load your fines."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadFines();
    }, []);


    /* ============================================================
       FILTER FINES
    ============================================================ */

    const filteredFines = useMemo(() => {

        return fines.filter((fine) => {

            const status =
                String(fine.status || "").toUpperCase();

            const type =
                String(fine.type || "").toUpperCase();


            const matchesStatus =
                statusFilter === "All Status" ||
                (statusFilter === "Paid" && status === "PAID") ||
                (
                    statusFilter === "Pending" &&
                    (
                        status === "PENDING" ||
                        status === "PARTIALLY_PAID"
                    )
                ) ||
                (
                    statusFilter === "Waived" &&
                    status === "WAIVED"
                );


            const matchesType =
                typeFilter === "All Types" ||
                normalizeType(type) === typeFilter;


            return matchesStatus && matchesType;

        });

    }, [fines, statusFilter, typeFilter]);


    /* ============================================================
       SUMMARY
    ============================================================ */

    const pendingFines = fines.filter((fine) => {

        const status =
            String(fine.status || "").toUpperCase();

        return (
            status === "PENDING" ||
            status === "PARTIALLY_PAID"
        );

    });


    const paidFines = fines.filter(
        (fine) =>
            String(fine.status || "").toUpperCase() === "PAID"
    );


    /*
     * Backend currently exposes the full fine amount.
     * amountPaid / amountOutstanding are not populated by
     * FineMapper in the current backend.
     *
     * Therefore:
     * - Pending amount = full amount
     * - Paid amount = full amount
     * - Outstanding = full amount for unpaid fines
     */

    const totalOutstanding = pendingFines.reduce(
        (total, fine) =>
            total + Number(fine.amount || 0),
        0
    );


    const totalPaid = paidFines.reduce(
        (total, fine) =>
            total + Number(fine.amount || 0),
        0
    );


    /* ============================================================
       PAY FINE
    ============================================================ */

    const handlePayFine = async (fine) => {

        try {

            setPayingFineId(fine.id);
            setError("");

            const response =
                await fineService.payFine(fine.id);


            /*
             * Backend returns PaymentInitiateResponse.
             * If a checkout URL is supplied, open it.
             */

            if (response?.checkoutUrl) {

                window.open(
                    response.checkoutUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

            } else if (response?.razorpayOrderId) {

                /*
                 * Razorpay order was created, but this backend
                 * response does not provide a complete frontend
                 * checkout configuration.
                 *
                 * Show the backend message instead of pretending
                 * the payment is completed.
                 */

                setError(
                    response?.message ||
                    "Payment has been initiated. Complete the payment through the provided payment flow."
                );

            } else {

                setError(
                    response?.message ||
                    "Payment could not be initiated."
                );

            }

        } catch (err) {

            console.error("Failed to initiate fine payment:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to initiate fine payment."
            );

        } finally {

            setPayingFineId(null);

        }
    };


    return (

        <div className="min-h-full bg-[#f7f8fc]">


            {/* ================= PAGE HEADER ================= */}

            <div className="border-b border-gray-200 bg-white px-6 py-5">

                <h1 className="text-[18px] font-semibold text-[#171725]">
                    My Fines
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Track and manage your library fines
                </p>

            </div>


            {/* ================= MAIN CONTENT ================= */}

            <div className="px-6 py-7 md:px-8">


                {/* ================= SUMMARY CARDS ================= */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">


                    {/* Pending Fines */}

                    <SummaryCard
                        title="Pending Fines"
                        value={pendingFines.length}
                        valueClass="text-[#c43b3b]"
                        background="bg-[#fff8f8]"
                        iconBackground="bg-red-100"
                        icon={
                            <AlertTriangle
                                size={21}
                                className="text-red-500"
                            />
                        }
                    />


                    {/* Paid Fines */}

                    <SummaryCard
                        title="Paid Fines"
                        value={paidFines.length}
                        valueClass="text-green-600"
                        background="bg-[#f3fff7]"
                        iconBackground="bg-green-100"
                        icon={
                            <CheckCircle2
                                size={21}
                                className="text-green-600"
                            />
                        }
                    />


                    {/* Total Outstanding */}

                    <SummaryCard
                        title="Total Outstanding"
                        value={formatCurrency(totalOutstanding)}
                        valueClass="text-[#d93636]"
                        background="bg-[#fff7f7]"
                        iconBackground="bg-red-100"
                        icon={
                            <IndianRupee
                                size={21}
                                className="text-red-500"
                            />
                        }
                    />


                    {/* Total Paid */}

                    <SummaryCard
                        title="Total Paid"
                        value={formatCurrency(totalPaid)}
                        valueClass="text-green-600"
                        background="bg-[#f3fff7]"
                        iconBackground="bg-green-100"
                        icon={
                            <IndianRupee
                                size={21}
                                className="text-green-600"
                            />
                        }
                    />

                </div>


                {/* ================= FILTERS ================= */}

                <div className="mt-7 flex flex-wrap items-center gap-3">

                    <div className="flex items-center gap-2 text-sm font-semibold text-[#6957e8]">

                        <Filter size={17} />

                        Filters

                    </div>


                    {/* Status */}

                    <div className="relative">

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="h-10 min-w-[120px] appearance-none rounded-md border border-gray-200 bg-white px-3 pr-9 text-xs text-gray-600 outline-none focus:border-[#6957e8]"
                        >

                            <option>All Status</option>
                            <option>Paid</option>
                            <option>Pending</option>
                            <option>Waived</option>

                        </select>

                        <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                    </div>


                    {/* Type */}

                    <div className="relative">

                        <select
                            value={typeFilter}
                            onChange={(e) =>
                                setTypeFilter(e.target.value)
                            }
                            className="h-10 min-w-[140px] appearance-none rounded-md border border-gray-200 bg-white px-3 pr-9 text-xs text-gray-600 outline-none focus:border-[#6957e8]"
                        >

                            <option>All Types</option>
                            <option>Overdue</option>
                            <option>Damage</option>
                            <option>Loss</option>
                            <option>Processing</option>

                        </select>

                        <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                    </div>

                </div>


                {/* ================= ERROR ================= */}

                {error && (

                    <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                        {error}

                    </div>

                )}


                {/* ================= LOADING ================= */}

                {loading ? (

                    <div className="mt-5 rounded-xl border border-gray-200 bg-white py-14 text-center shadow-sm">

                        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#6957e8]" />

                        <p className="text-sm text-gray-500">
                            Loading your fines...
                        </p>

                    </div>

                ) : (

                    <>
                        {/* ================= FINE LIST ================= */}

                        <div className="mt-4 space-y-5">

                            {filteredFines.map((fine) => (

                                <FineCard
                                    key={fine.id}
                                    fine={fine}
                                    onPay={handlePayFine}
                                    payingFineId={payingFineId}
                                />

                            ))}

                        </div>


                        {/* ================= EMPTY STATE ================= */}

                        {filteredFines.length === 0 && (

                            <div className="mt-5 rounded-xl border border-gray-200 bg-white py-14 text-center">

                                <Receipt
                                    size={38}
                                    className="mx-auto text-gray-300"
                                />

                                <h3 className="mt-3 text-sm font-semibold text-gray-700">
                                    No fines found
                                </h3>

                                <p className="mt-1 text-xs text-gray-400">
                                    Try changing the selected filters.
                                </p>

                            </div>

                        )}

                    </>

                )}

            </div>

        </div>
    );
}


/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
    title,
    value,
    valueClass,
    background,
    iconBackground,
    icon,
}) {

    return (

        <div className={`rounded-xl border border-gray-200 ${background} p-5 shadow-sm`}>

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-xs font-medium text-gray-500">
                        {title}
                    </p>

                    <p className={`mt-2 text-3xl font-bold ${valueClass}`}>
                        {value}
                    </p>

                </div>

                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconBackground}`}>
                    {icon}
                </div>

            </div>

        </div>
    );
}


/* ============================================================
   FINE CARD
============================================================ */

function FineCard({
    fine,
    onPay,
    payingFineId,
}) {

    const status =
        String(fine.status || "").toUpperCase();

    const type =
        String(fine.type || "").toUpperCase();


    const isPaid = status === "PAID";
    const isWaived = status === "WAIVED";

    const amount =
        Number(fine.amount || 0);


    /*
     * The current backend mapper does not populate
     * amountPaid / amountOutstanding.
     */

    const amountPaid =
        isPaid ? amount : 0;

    const outstanding =
        isPaid || isWaived ? 0 : amount;


    return (

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">


            {/* ================= CARD TOP ================= */}

            <div
                className={`border-t-4 px-5 py-5 ${
                    isPaid || isWaived
                        ? "border-green-400"
                        : "border-red-400"
                }`}
            >


                {/* Fine Number */}

                <div className="flex items-center gap-2 text-xs text-gray-500">

                    <Receipt size={14} />

                    <span>
                        FINE #{fine.id}
                    </span>

                </div>


                {/* Book Title */}

                <h2 className="mt-3 text-xl font-semibold text-[#263b66]">
                    {fine.bookTitle || "Library Fine"}
                </h2>


                {/* ISBN */}

                {fine.bookIsbn && (

                    <p className="mt-1 text-xs text-gray-400">
                        ISBN: {fine.bookIsbn}
                    </p>

                )}


                {/* Status + Type */}

                <div className="mt-3 flex flex-wrap items-center gap-2">


                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${
                            isPaid
                                ? "bg-green-100 text-green-700"
                                : isWaived
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-red-100 text-red-600"
                        }`}
                    >

                        {isPaid ? (

                            <CheckCircle2 size={13} />

                        ) : isWaived ? (

                            <CheckCircle2 size={13} />

                        ) : (

                            <AlertTriangle size={13} />

                        )}

                        {formatStatus(status)}

                    </span>


                    <span className="rounded-full border border-[#ead9ae] bg-[#fff9e9] px-3 py-1 text-[11px] font-medium text-[#a0782b]">
                        {formatType(type)}
                    </span>

                </div>


                {/* ================= REASON ================= */}

                {fine.reason && (

                    <div className="mt-5 rounded-md bg-[#f4f9ff] px-4 py-3">

                        <p className="text-xs">

                            <span className="font-semibold text-[#4d89b5]">
                                Reason:
                            </span>{" "}

                            <span className="text-gray-600">
                                {fine.reason}
                            </span>

                        </p>

                    </div>

                )}


                {/* ================= AMOUNT INFORMATION ================= */}

                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">


                    {/* Total */}

                    <div className="rounded-lg bg-[#f7fbff] p-4">

                        <div className="flex items-center gap-2">

                            <IndianRupee
                                size={15}
                                className="text-[#3984bd]"
                            />

                            <span className="text-[10px] text-gray-500">
                                Total Amount
                            </span>

                        </div>

                        <p className="mt-2 text-sm font-bold text-[#3984bd]">
                            {formatCurrency(amount)}
                        </p>

                    </div>


                    {/* Paid */}

                    <div className="rounded-lg bg-[#f3fff7] p-4">

                        <div className="flex items-center gap-2">

                            <CheckCircle2
                                size={15}
                                className="text-green-500"
                            />

                            <span className="text-[10px] text-gray-500">
                                Amount Paid
                            </span>

                        </div>

                        <p className="mt-2 text-sm font-bold text-green-600">
                            {formatCurrency(amountPaid)}
                        </p>

                    </div>


                    {/* Outstanding */}

                    <div className="rounded-lg bg-[#fff7f7] p-4">

                        <div className="flex items-center gap-2">

                            <AlertTriangle
                                size={15}
                                className="text-red-500"
                            />

                            <span className="text-[10px] text-gray-500">
                                Outstanding
                            </span>

                        </div>

                        <p className="mt-2 text-sm font-bold text-red-600">
                            {formatCurrency(outstanding)}
                        </p>

                    </div>


                    {/* Created Date */}

                    <div className="rounded-lg bg-[#fafafa] p-4">

                        <div className="flex items-center gap-2">

                            <CalendarDays
                                size={15}
                                className="text-gray-500"
                            />

                            <span className="text-[10px] text-gray-500">
                                Created Date
                            </span>

                        </div>

                        <p className="mt-2 text-sm font-bold text-gray-700">
                            {formatDate(fine.createdAt)}
                        </p>

                    </div>

                </div>


                {/* ================= PAID MESSAGE ================= */}

                {isPaid && (

                    <div className="mt-5 rounded-lg border border-green-300 bg-green-100 px-4 py-3">

                        <div className="flex items-center gap-2">

                            <CheckCircle2
                                size={18}
                                className="text-green-500"
                            />

                            <div>

                                <p className="text-sm font-semibold text-green-600">
                                    This fine has been paid in full
                                </p>

                                {fine.paidAt && (

                                    <p className="text-[10px] text-green-600">
                                        Paid on {formatDate(fine.paidAt)}
                                    </p>

                                )}

                            </div>

                        </div>

                    </div>

                )}


                {/* ================= WAIVED MESSAGE ================= */}

                {isWaived && (

                    <div className="mt-5 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3">

                        <div className="flex items-center gap-2">

                            <CheckCircle2
                                size={18}
                                className="text-gray-500"
                            />

                            <div>

                                <p className="text-sm font-semibold text-gray-600">
                                    This fine has been waived
                                </p>

                                {fine.waiverReason && (

                                    <p className="text-[10px] text-gray-500">
                                        {fine.waiverReason}
                                    </p>

                                )}

                            </div>

                        </div>

                    </div>

                )}


                {/* ================= PAY BUTTON ================= */}

                {!isPaid && !isWaived && (

                    <button
                        type="button"
                        disabled={payingFineId === fine.id}
                        onClick={() => onPay(fine)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#6957e8] py-3 text-sm font-semibold text-white transition hover:bg-[#5846d6] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <IndianRupee size={16} />

                        {payingFineId === fine.id
                            ? "Initiating Payment..."
                            : "Pay Outstanding Fine"}

                    </button>

                )}

            </div>

        </div>
    );
}


/* ============================================================
   HELPERS
============================================================ */

function normalizeType(type) {

    const map = {
        OVERDUE: "Overdue",
        DAMAGE: "Damage",
        LOSS: "Loss",
        PROCESSING: "Processing",
    };

    return map[type] || type;
}


function formatType(type) {
    return normalizeType(type);
}


function formatStatus(status) {

    const map = {
        PENDING: "Pending",
        PARTIALLY_PAID: "Partially Paid",
        PAID: "Paid in Full",
        WAIVED: "Waived",
    };

    return map[status] || status;
}


function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
    }).format(Number(amount || 0));
}


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


export default Fines;