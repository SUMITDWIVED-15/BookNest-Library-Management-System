import { useEffect, useMemo, useState } from "react";
import {
    Clock3,
    CheckCircle2,
    XCircle,
    CalendarDays,
    BookOpen,
    Timer,
} from "lucide-react";

import reservationService from "../../services/reservationService";

function Reservations() {

    const [reservations, setReservations] = useState([]);
    const [activeTab, setActiveTab] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReservations = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await reservationService.getMyReservations({
                page: 0,
                size: 20,
            });

            setReservations(response?.content || []);
        } catch (err) {
            console.error("Failed to load reservations:", err);

            setReservations([]);

            setError(
                err?.response?.data?.message ||
                "Failed to load your reservations."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReservations();
    }, []);


    const normalizedReservations = useMemo(() => {

        return reservations.map((reservation) => {

            const status = String(
                reservation.status || ""
            ).toUpperCase();

            let type = "pending";

            if (status === "READY") {
                type = "ready";
            } else if (status === "FULFILLED") {
                type = "fulfilled";
            } else if (status === "CANCELLED") {
                type = "cancelled";
            } else if (status === "EXPIRED") {
                type = "expired";
            }

            return {
                ...reservation,
                type,
            };
        });

    }, [reservations]);


    const filteredReservations = useMemo(() => {

        if (activeTab === "all") {
            return normalizedReservations;
        }

        if (activeTab === "active") {
            return normalizedReservations.filter(
                (reservation) =>
                    reservation.status === "PENDING" ||
                    reservation.status === "READY"
            );
        }

        return normalizedReservations.filter(
            (reservation) =>
                reservation.status === "FULFILLED" ||
                reservation.status === "CANCELLED" ||
                reservation.status === "EXPIRED"
        );

    }, [activeTab, normalizedReservations]);


    const totalReservations = normalizedReservations.length;

    const activeReservations =
        normalizedReservations.filter(
            (reservation) =>
                reservation.status === "PENDING" ||
                reservation.status === "READY"
        ).length;

    const readyReservations =
        normalizedReservations.filter(
            (reservation) =>
                reservation.status === "READY"
        ).length;


    return (
        <div className="min-h-full bg-[#f7f8fc]">

            {/* ================= PAGE HEADER ================= */}

            <div className="border-b border-gray-200 bg-white px-6 py-5">

                <h1 className="text-[18px] font-semibold text-[#171725]">
                    My Reservations
                </h1>

            </div>


            {/* ================= MAIN CONTENT ================= */}

            <div className="px-6 py-7 md:px-8">


                {/* ================= TITLE ================= */}

                <div className="mb-7">

                    <h2 className="flex items-center gap-3 text-3xl font-bold text-[#6957e8]">

                        <CalendarDays
                            size={31}
                            strokeWidth={2}
                        />

                        My Reservation

                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage and track your book reservations
                    </p>

                </div>


                {/* ================= STAT CARDS ================= */}

                <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-3">


                    {/* Total Reservation */}

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            TOTAL RESERVATION
                        </p>

                        <div className="mt-2 flex items-center justify-between">

                            <span className="text-3xl font-bold text-[#171725]">
                                {totalReservations}
                            </span>

                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100">

                                <BookOpen
                                    size={21}
                                    className="text-purple-600"
                                />

                            </div>

                        </div>

                    </div>


                    {/* Active Reservation */}

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            ACTIVE RESERVATION
                        </p>

                        <div className="mt-2 flex items-center justify-between">

                            <span className="text-3xl font-bold text-[#171725]">
                                {activeReservations}
                            </span>

                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100">

                                <Timer
                                    size={21}
                                    className="text-orange-500"
                                />

                            </div>

                        </div>

                    </div>


                    {/* Ready To Pickup */}

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            READY TO PICKUP
                        </p>

                        <div className="mt-2 flex items-center justify-between">

                            <span className="text-3xl font-bold text-[#171725]">
                                {readyReservations}
                            </span>

                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100">

                                <CalendarDays
                                    size={21}
                                    className="text-green-600"
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= FILTER TABS ================= */}

                <div className="mb-5 overflow-hidden rounded-xl border border-gray-200 bg-white">

                    <div className="grid grid-cols-3">


                        {/* ALL */}

                        <button
                            type="button"
                            onClick={() => setActiveTab("all")}
                            className={`
                                border-b-2 px-5 py-4 text-sm font-semibold transition
                                ${
                                    activeTab === "all"
                                        ? "border-[#6957e8] text-[#6957e8]"
                                        : "border-transparent text-gray-500 hover:bg-gray-50"
                                }
                            `}
                        >

                            <BookOpen
                                size={15}
                                className="mr-2 inline"
                            />

                            All Reservations

                        </button>


                        {/* ACTIVE */}

                        <button
                            type="button"
                            onClick={() => setActiveTab("active")}
                            className={`
                                border-b-2 px-5 py-4 text-sm font-medium transition
                                ${
                                    activeTab === "active"
                                        ? "border-[#6957e8] font-semibold text-[#6957e8]"
                                        : "border-transparent text-gray-500 hover:bg-gray-50"
                                }
                            `}
                        >

                            <Clock3
                                size={15}
                                className="mr-2 inline"
                            />

                            Active

                        </button>


                        {/* COMPLETED */}

                        <button
                            type="button"
                            onClick={() => setActiveTab("completed")}
                            className={`
                                border-b-2 px-5 py-4 text-sm font-medium transition
                                ${
                                    activeTab === "completed"
                                        ? "border-[#6957e8] font-semibold text-[#6957e8]"
                                        : "border-transparent text-gray-500 hover:bg-gray-50"
                                }
                            `}
                        >

                            <CheckCircle2
                                size={15}
                                className="mr-2 inline"
                            />

                            Completed

                        </button>

                    </div>

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
                            Loading your reservations...
                        </p>

                    </div>

                ) : (

                    /* ================= RESERVATION CARDS ================= */

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">

                        {filteredReservations.length > 0 ? (

                            filteredReservations.map((reservation) => (

                                <ReservationCard
                                    key={reservation.id}
                                    reservation={reservation}
                                    onCancel={loadReservations}
                                />

                            ))

                        ) : (

                            <div className="col-span-full rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                                <CalendarDays
                                    size={42}
                                    className="mx-auto mb-3 text-gray-300"
                                />

                                <h3 className="font-semibold text-gray-700">
                                    No reservations found
                                </h3>

                                <p className="mt-1 text-sm text-gray-400">
                                    There are no reservations in this category.
                                </p>

                            </div>

                        )}

                    </div>

                )}

            </div>

        </div>
    );
}


/* ============================================================
   RESERVATION CARD
============================================================ */

function ReservationCard({
    reservation,
    onCancel,
}) {

    const statusStyles = {

        pending: {
            header: "bg-[#fff3a6]",
            text: "text-[#665b00]",
            icon: Timer,
            iconColor: "text-[#665b00]",
        },

        ready: {
            header: "bg-[#e5e7eb]",
            text: "text-[#374151]",
            icon: Clock3,
            iconColor: "text-gray-700",
        },

        fulfilled: {
            header: "bg-[#b9d8f8]",
            text: "text-[#1e3a5f]",
            icon: CheckCircle2,
            iconColor: "text-gray-800",
        },

        cancelled: {
            header: "bg-[#ffcaca]",
            text: "text-[#8f2929]",
            icon: XCircle,
            iconColor: "text-red-700",
        },

        expired: {
            header: "bg-[#e5e7eb]",
            text: "text-gray-600",
            icon: Clock3,
            iconColor: "text-gray-600",
        },

    };


    const style =
        statusStyles[reservation.type] ||
        statusStyles.pending;

    const StatusIcon = style.icon;


    const bookTitle =
        reservation.bookTitle ||
        reservation.title ||
        "Unknown Book";


    const bookId =
        reservation.bookId ??
        reservation.id;


    const reservedDate =
        reservation.reservedAt ||
        reservation.reservationDate ||
        reservation.createdAt;


    const availableDate =
        reservation.availableAt ||
        reservation.availableDate;


    const fulfilledDate =
        reservation.fulfilledAt ||
        reservation.fulfilledDate;


    return (

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">


            {/* ================= STATUS HEADER ================= */}

            <div className={`flex items-center gap-2 px-4 py-3 ${style.header}`}>

                <StatusIcon
                    size={15}
                    className={style.iconColor}
                />

                <span
                    className={`text-[11px] font-bold tracking-wide ${style.text}`}
                >
                    {reservation.status || "PENDING"}
                </span>

            </div>


            {/* ================= CARD BODY ================= */}

            <div className="p-5">


                {/* Book Information */}

                <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600">

                        <BookOpen
                            size={19}
                            className="text-white"
                        />

                    </div>


                    <div className="min-w-0">

                        <p className="text-xs text-gray-400">
                            Book Id
                        </p>

                        <p className="text-sm font-semibold text-gray-700">
                            #{bookId}
                        </p>

                        <h3 className="mt-2 text-sm font-medium leading-5 text-[#171725]">
                            {bookTitle}
                        </h3>

                    </div>

                </div>


                {/* Divider */}

                <div className="my-4 border-t border-gray-100" />


                {/* Reserved */}

                {reservedDate && (

                    <div className="flex items-start gap-2">

                        <Clock3
                            size={15}
                            className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <div>

                            <p className="text-[10px] font-semibold uppercase text-gray-400">
                                RESERVED
                            </p>

                            <p className="mt-0.5 break-all text-[10px] text-gray-500">
                                {formatDateTime(reservedDate)}
                            </p>

                        </div>

                    </div>

                )}


                {/* Available */}

                {availableDate && (

                    <div className="mt-3 flex items-start gap-2">

                        <CalendarDays
                            size={15}
                            className="mt-0.5 shrink-0 text-green-500"
                        />

                        <div>

                            <p className="text-[10px] font-semibold uppercase text-green-500">
                                AVAILABLE
                            </p>

                            <p className="mt-0.5 break-all text-[10px] text-green-600">
                                {formatDateTime(availableDate)}
                            </p>

                        </div>

                    </div>

                )}


                {/* Fulfilled */}

                {fulfilledDate && (

                    <div className="mt-3 flex items-start gap-2">

                        <CheckCircle2
                            size={15}
                            className="mt-0.5 shrink-0 text-blue-500"
                        />

                        <div>

                            <p className="text-[10px] font-semibold uppercase text-blue-500">
                                FULFILLED
                            </p>

                            <p className="mt-0.5 break-all text-[10px] text-blue-600">
                                {formatDateTime(fulfilledDate)}
                            </p>

                        </div>

                    </div>

                )}


                {/* ================= CANCEL ================= */}

                {(reservation.status === "PENDING" ||
                    reservation.status === "READY") && (

                    <button
                        type="button"
                        onClick={async () => {

                            try {

                                await reservationService.cancelReservation(
                                    reservation.id
                                );

                                await onCancel();

                            } catch (err) {

                                console.error(
                                    "Failed to cancel reservation:",
                                    err
                                );

                            }

                        }}
                        className="mt-5 w-full rounded-md border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                        Cancel Reservation
                    </button>

                )}

            </div>

        </div>
    );
}


/* ============================================================
   DATE FORMATTER
============================================================ */

function formatDateTime(date) {

    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return String(date);
    }

    return parsedDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}


export default Reservations;