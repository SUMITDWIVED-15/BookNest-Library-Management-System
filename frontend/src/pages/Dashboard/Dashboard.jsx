import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Clock3,
    BookOpen,
    CalendarDays,
    Sparkles,
    CheckCircle2
} from "lucide-react";

import loanService from "../../services/loanService";
import reservationService from "../../services/reservationService";
import fineService from "../../services/fineService";
import subscriptionService from "../../services/subscriptionService";
import wishlistService from "../../services/wishlistService";
import profileService from "../../services/profileService";

import { formatDate } from "../../utils/formatters";


function Dashboard() {

    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("loans");

    const [dashboardData, setDashboardData] = useState({
        loans: [],
        reservations: [],
        history: [],
        fines: [],
        subscription: null,
        wishlist: [],
        profile: null
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const tabs = [
        {
            id: "loans",
            label: "Current Loans"
        },
        {
            id: "reservations",
            label: "Reservations"
        },
        {
            id: "history",
            label: "Reading History"
        },
        {
            id: "recommendations",
            label: "Recommendations"
        }
    ];


    /* ============================================================
       LOAD DASHBOARD DATA
    ============================================================ */

    useEffect(() => {

        const loadDashboardData = async () => {

            setLoading(true);
            setError("");

            try {

                const [
                    loansResponse,
                    reservationsResponse,
                    historyResponse,
                    finesResponse,
                    subscriptionResponse,
                    wishlistResponse,
                    profileResponse
                ] = await Promise.allSettled([

                    loanService.getMyLoans({
                        page: 0,
                        size: 20
                    }),

                    reservationService.getMyReservations({
                        activeOnly: true,
                        page: 0,
                        size: 20,
                        sortBy: "reservedAt",
                        sortDirection: "DESC"
                    }),

                    loanService.getMyLoans({
                        status: "RETURNED",
                        page: 0,
                        size: 20
                    }),

                    fineService.getMyFines(),

                    subscriptionService.getActiveSubscription(),

                    wishlistService.getMyWishlist({
                        page: 0,
                        size: 20
                    }),

                    profileService.getProfile()

                ]);


                const getValue = (result, fallback) => {

                    if (result.status === "fulfilled") {
                        return result.value;
                    }

                    return fallback;
                };


                const loansData = getValue(loansResponse, {
                    content: []
                });

                const reservationsData = getValue(reservationsResponse, {
                    content: []
                });

                const historyData = getValue(historyResponse, {
                    content: []
                });

                const finesData = getValue(finesResponse, []);

                const subscriptionData = getValue(
                    subscriptionResponse,
                    null
                );

                const wishlistData = getValue(wishlistResponse, {
                    content: []
                });

                const profileData = getValue(
                    profileResponse,
                    null
                );


                setDashboardData({

                    loans: Array.isArray(loansData)
                        ? loansData
                        : loansData?.content || [],

                    reservations: Array.isArray(reservationsData)
                        ? reservationsData
                        : reservationsData?.content || [],

                    history: Array.isArray(historyData)
                        ? historyData
                        : historyData?.content || [],

                    fines: Array.isArray(finesData)
                        ? finesData
                        : [],

                    subscription: subscriptionData,

                    wishlist: Array.isArray(wishlistData)
                        ? wishlistData
                        : wishlistData?.content || [],

                    profile: profileData

                });

            } catch (err) {

                console.error(
                    "Dashboard loading error:",
                    err
                );

                setError(
                    "Some dashboard information could not be loaded."
                );

            } finally {

                setLoading(false);

            }

        };


        loadDashboardData();

    }, []);


    /* ============================================================
       DASHBOARD COUNTS
    ============================================================ */

    const currentLoans = dashboardData.loans.filter(
        (loan) =>
            loan.status === "CHECKED_OUT" ||
            loan.status === "OVERDUE"
    );


    const booksRead = dashboardData.history.length;


    const reservationsCount =
        dashboardData.reservations.length;


    /* ============================================================
       LOADING
    ============================================================ */

    if (loading) {

        return (

            <div className="min-h-full bg-gradient-to-br from-[#f4f6ff] via-white to-[#f8eaff] p-7">

                <div className="flex items-center justify-center min-h-[500px]">

                    <div className="text-center">

                        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto">
                        </div>

                        <p className="mt-4 text-sm text-gray-500">
                            Loading your dashboard...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="min-h-full bg-gradient-to-br from-[#f4f6ff] via-white to-[#f8eaff] p-7">


            {/* ================= DASHBOARD INTRO ================= */}

            <div className="mb-7">

                <h1 className="text-3xl font-bold text-gray-900">

                    My{" "}

                    <span className="text-purple-600">
                        Dashboard
                    </span>

                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Track your reading journey and manage your library
                </p>

                {error && (

                    <p className="mt-2 text-xs text-orange-500">
                        {error}
                    </p>

                )}

            </div>



            {/* ================= STAT CARDS ================= */}

            <div className="grid grid-cols-4 gap-5 mb-7">


                {/* Current Loans */}

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

                    <div className="flex items-start justify-between">

                        <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center">

                            <BookOpen
                                size={22}
                                className="text-purple-600"
                            />

                        </div>

                        <span className="text-2xl font-bold text-purple-600">
                            {currentLoans.length}
                        </span>

                    </div>

                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                        Current Loans
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        Books you're reading
                    </p>

                </div>



                {/* Reservations */}

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

                    <div className="flex items-start justify-between">

                        <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center">

                            <CalendarDays
                                size={22}
                                className="text-purple-600"
                            />

                        </div>

                        <span className="text-2xl font-bold text-purple-600">
                            {reservationsCount}
                        </span>

                    </div>

                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                        Reservations
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        Books on hold
                    </p>

                </div>



                {/* Books Read */}

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

                    <div className="flex items-start justify-between">

                        <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center">

                            <CheckCircle2
                                size={22}
                                className="text-green-600"
                            />

                        </div>

                        <span className="text-2xl font-bold text-green-600">
                            {booksRead}
                        </span>

                    </div>

                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                        Books Read
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        This year
                    </p>

                </div>



                {/* Day Streak */}

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

                    <div className="flex items-start justify-between">

                        <div className="w-11 h-11 rounded-lg bg-orange-100 flex items-center justify-center">

                            <Sparkles
                                size={22}
                                className="text-orange-500"
                            />

                        </div>

                        {/* No backend endpoint exists for reading streak */}

                        <span className="text-2xl font-bold text-orange-500">
                            7
                        </span>

                    </div>

                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                        Day Streak
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        Keep it going!
                    </p>

                </div>

            </div>



            {/* ================= READING GOAL ================= */}

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-7">

                <div className="flex items-start justify-between">

                    <div>

                        <h2 className="text-lg font-bold text-gray-900">
                            2025 Reading Goal
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            {booksRead} of 30 books read
                        </p>

                    </div>


                    <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center">

                        <Sparkles
                            size={21}
                            className="text-purple-600"
                        />

                    </div>

                </div>


                {/* Progress */}

                <div className="mt-5">

                    <div className="h-2.5 bg-[#e5e9f7] rounded-full overflow-hidden">

                        <div
                            className="h-full bg-gradient-to-r from-purple-600 to-purple-500 rounded-full"
                            style={{
                                width: `${Math.min(
                                    (booksRead / 30) * 100,
                                    100
                                )}%`
                            }}
                        >
                        </div>

                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                        {Math.min(
                            Math.round((booksRead / 30) * 100),
                            100
                        )}% complete
                    </p>

                </div>

            </div>



            {/* ================= TABS + CONTENT ================= */}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">


                {/* TAB BAR */}

                <div className="flex border-b border-gray-200 px-4">

                    {tabs.map((tab) => (

                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                px-4 py-4 text-sm font-medium transition relative
                                ${
                                    activeTab === tab.id
                                        ? "text-purple-600"
                                        : "text-gray-500 hover:text-gray-800"
                                }
                            `}
                        >

                            {tab.label}

                            {activeTab === tab.id && (

                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-600">
                                </span>

                            )}

                        </button>

                    ))}

                </div>



                {/* CONTENT */}

                <div className="p-5">


                    {activeTab === "loans" && (

                        <CurrentLoans
                            books={currentLoans}
                            navigate={navigate}
                        />

                    )}


                    {activeTab === "reservations" && (

                        <Reservations
                            reservations={dashboardData.reservations}
                            navigate={navigate}
                        />

                    )}


                    {activeTab === "history" && (

                        <ReadingHistory
                            books={dashboardData.history}
                            navigate={navigate}
                        />

                    )}


                    {activeTab === "recommendations" && (

                        <Recommendations
                            wishlist={dashboardData.wishlist}
                            navigate={navigate}
                        />

                    )}

                </div>

            </div>

        </div>

    );

}



/* ============================================================
   CURRENT LOANS
============================================================ */

function CurrentLoans({ books, navigate }) {

    return (

        <div>

            <h2 className="text-lg font-bold text-gray-900 mb-5">
                Books You're Currently Reading
            </h2>


            {books.length === 0 ? (

                <EmptyState message="You have no current loans." />

            ) : (

                <div className="space-y-4">

                    {books.map((book) => (

                        <div
                            key={book.id}
                            className="border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition"
                        >

                            {/* Book Image */}

                            <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">

                                {book.bookCoverImage ? (

                                    <img
                                        src={book.bookCoverImage}
                                        alt={book.bookTitle}
                                        className="w-full h-full object-cover"
                                    />

                                ) : (

                                    <BookOpen
                                        size={24}
                                        className="text-gray-500"
                                    />

                                )}

                            </div>


                            {/* Book Details */}

                            <div className="flex-1">

                                <h3 className="text-sm font-semibold text-gray-900">
                                    {book.bookTitle}
                                </h3>

                                <p className="text-xs text-gray-500 mt-1">
                                    {book.bookAuthor}
                                </p>


                                <div className="flex items-center gap-2 mt-3">

                                    <div className="flex items-center gap-1 text-xs text-gray-500">

                                        <Clock3 size={13} />

                                        Due: {formatDate(book.dueDate)}

                                    </div>


                                    <span className="px-2 py-1 rounded-full bg-gray-100 text-[10px] font-medium text-gray-600">
                                        {book.status}
                                    </span>


                                    {book.isOverdue && (

                                        <span className="px-2 py-1 rounded-full border border-pink-200 text-[10px] text-pink-500">
                                            {book.overdueDays} days overdue
                                        </span>

                                    )}

                                </div>

                            </div>


                            {/* View */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/books/${book.bookId}`)
                                }
                                className="px-4 py-2 border border-purple-300 rounded-lg text-xs font-medium text-purple-600 hover:bg-purple-50 transition"
                            >
                                VIEW
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}



/* ============================================================
   RESERVATIONS
============================================================ */

function Reservations({ reservations, navigate }) {

    return (

        <div>

            <h2 className="text-lg font-bold text-gray-900 mb-5">
                Your Reservations
            </h2>


            {reservations.length === 0 ? (

                <EmptyState message="You have no active reservations." />

            ) : (

                <div className="space-y-4">

                    {reservations.map((reservation) => (

                        <div
                            key={reservation.id}
                            className="border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition"
                        >

                            <div className="w-12 h-16 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">

                                <CalendarDays
                                    size={23}
                                    className="text-purple-600"
                                />

                            </div>


                            <div className="flex-1">

                                <h3 className="text-sm font-semibold text-gray-900">
                                    {reservation.bookTitle}
                                </h3>

                                <p className="text-xs text-gray-500 mt-1">
                                    {reservation.bookAuthor}
                                </p>

                                <div className="flex items-center gap-3 mt-3">

                                    <span className="px-2 py-1 rounded-full bg-purple-50 text-[10px] text-purple-600 font-medium">
                                        {reservation.queuePosition
                                            ? `${getOrdinal(reservation.queuePosition)} in queue`
                                            : reservation.status}
                                    </span>

                                    <span className="text-xs text-gray-400">
                                        Reserved on{" "}
                                        {formatDate(reservation.reservedAt)}
                                    </span>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/books/${reservation.bookId}`
                                    )
                                }
                                className="px-4 py-2 border border-purple-300 rounded-lg text-xs font-medium text-purple-600 hover:bg-purple-50 transition"
                            >
                                VIEW
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}



/* ============================================================
   READING HISTORY
============================================================ */

function ReadingHistory({ books, navigate }) {

    return (

        <div>

            <h2 className="text-lg font-bold text-gray-900 mb-5">
                Your Reading History
            </h2>


            {books.length === 0 ? (

                <EmptyState message="No returned books found." />

            ) : (

                <div className="space-y-4">

                    {books.map((book) => (

                        <div
                            key={book.id}
                            className="border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm"
                        >

                            <div className="w-12 h-16 rounded-lg overflow-hidden bg-green-100 flex items-center justify-center shrink-0">

                                {book.bookCoverImage ? (

                                    <img
                                        src={book.bookCoverImage}
                                        alt={book.bookTitle}
                                        className="w-full h-full object-cover"
                                    />

                                ) : (

                                    <CheckCircle2
                                        size={23}
                                        className="text-green-600"
                                    />

                                )}

                            </div>


                            <div className="flex-1">

                                <h3 className="text-sm font-semibold text-gray-900">
                                    {book.bookTitle}
                                </h3>

                                <p className="text-xs text-gray-500 mt-1">
                                    {book.bookAuthor}
                                </p>

                                <p className="text-xs text-green-600 mt-3">
                                    Returned on{" "}
                                    {formatDate(book.returnDate)}
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/books/${book.bookId}`)
                                }
                                className="px-4 py-2 border border-purple-300 rounded-lg text-xs font-medium text-purple-600 hover:bg-purple-50 transition"
                            >
                                VIEW
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}



/* ============================================================
   RECOMMENDATIONS
============================================================ */

function Recommendations({ wishlist, navigate }) {

    return (

        <div>

            <h2 className="text-lg font-bold text-gray-900 mb-5">
                Recommended For You
            </h2>


            {wishlist.length === 0 ? (

                <EmptyState message="No recommendations available yet." />

            ) : (

                <div className="space-y-4">

                    {wishlist.slice(0, 5).map((item) => {

                        const bookId =
                            item.bookId ||
                            item.book?.id;

                        const title =
                            item.bookTitle ||
                            item.book?.title ||
                            "Book";

                        const author =
                            item.bookAuthor ||
                            item.book?.author ||
                            "";

                        return (

                            <div
                                key={item.id || bookId}
                                className="border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition"
                            >

                                <div className="w-12 h-16 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">

                                    <Sparkles
                                        size={23}
                                        className="text-purple-600"
                                    />

                                </div>


                                <div className="flex-1">

                                    <h3 className="text-sm font-semibold text-gray-900">
                                        {title}
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {author}
                                    </p>

                                    <p className="text-xs text-purple-500 mt-3">
                                        From your wishlist
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        bookId &&
                                        navigate(`/books/${bookId}`)
                                    }
                                    className="px-4 py-2 border border-purple-300 rounded-lg text-xs font-medium text-purple-600 hover:bg-purple-50 transition"
                                >
                                    VIEW
                                </button>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );

}



/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({ message }) {

    return (

        <div className="py-12 text-center">

            <BookOpen
                size={32}
                className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm text-gray-400">
                {message}
            </p>

        </div>

    );

}



/* ============================================================
   ORDINAL HELPER
============================================================ */

function getOrdinal(number) {

    const value = Number(number);

    if (value % 100 >= 11 && value % 100 <= 13) {
        return `${value}th`;
    }

    switch (value % 10) {

        case 1:
            return `${value}st`;

        case 2:
            return `${value}nd`;

        case 3:
            return `${value}rd`;

        default:
            return `${value}th`;

    }

}


export default Dashboard;