import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Heart,
    Star,
    Trash2,
    ArrowRight,
    Search,
    Loader2
} from "lucide-react";

import wishlistService from "../../services/wishlistService";


function Wishlist() {

    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [removingBookId, setRemovingBookId] = useState(null);

    const [error, setError] = useState("");


    /* ============================================================
       LOAD WISHLIST
    ============================================================ */

    const loadWishlist = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await wishlistService.getMyWishlist({
                    page: 0,
                    size: 20
                });


            /*
             * Backend returns PageResponse<WishlistDTO>.
             *
             * Actual structure:
             * {
             *     content: [...],
             *     pageNumber,
             *     pageSize,
             *     totalPages,
             *     totalElements,
             *     last,
             *     first,
             *     empty
             * }
             */

            setWishlist(
                Array.isArray(response?.content)
                    ? response.content
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load wishlist:",
                err
            );

            setWishlist([]);

            setError(
                err?.response?.data?.message ||
                "Failed to load your wishlist."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadWishlist();
    }, []);


    /* ============================================================
       SEARCH
    ============================================================ */

    const filteredWishlist = useMemo(() => {

        const text =
            search.trim().toLowerCase();


        if (!text) {
            return wishlist;
        }


        return wishlist.filter((item) => {

            const book = item.book;

            if (!book) {
                return false;
            }


            return (
                String(book.title || "")
                    .toLowerCase()
                    .includes(text) ||

                String(book.author || "")
                    .toLowerCase()
                    .includes(text) ||

                String(book.genreName || "")
                    .toLowerCase()
                    .includes(text) ||

                String(book.isbn || "")
                    .toLowerCase()
                    .includes(text)
            );

        });

    }, [wishlist, search]);


    /* ============================================================
       REMOVE FROM WISHLIST
    ============================================================ */

    const removeBook = async (bookId) => {

        try {

            setRemovingBookId(bookId);
            setError("");


            await wishlistService.removeFromWishlist(
                bookId
            );


            setWishlist((current) =>
                current.filter(
                    (item) =>
                        item.book?.id !== bookId
                )
            );

        } catch (err) {

            console.error(
                "Failed to remove book from wishlist:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to remove the book from your wishlist."
            );

        } finally {

            setRemovingBookId(null);

        }
    };


    return (

        <div className="min-h-full bg-gradient-to-br from-[#f4f6ff] via-white to-[#f8eaff] p-7">


            {/* ================= HEADER ================= */}

            <div className="mb-7">

                <h1 className="text-3xl font-bold text-gray-900">

                    My{" "}

                    <span className="text-purple-600">
                        Wishlist
                    </span>

                </h1>


                <p className="mt-2 text-sm text-gray-500">
                    Save your favorite books and read them later
                </p>

            </div>


            {/* ================= SEARCH ================= */}

            <div className="mb-7 flex flex-col gap-4 sm:flex-row">


                <div className="relative flex-1">

                    <Search
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />


                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search your wishlist..."
                        className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />

                </div>


                <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5">

                    <Heart
                        size={18}
                        className="mr-2 fill-purple-600 text-purple-600"
                    />


                    <span className="text-sm font-medium text-gray-700">

                        {wishlist.length} Saved Books

                    </span>

                </div>

            </div>


            {/* ================= ERROR ================= */}

            {error && (

                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                    {error}

                </div>

            )}


            {/* ================= LOADING ================= */}

            {loading ? (

                <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">

                    <Loader2
                        size={35}
                        className="mx-auto animate-spin text-purple-600"
                    />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading your wishlist...
                    </p>

                </div>

            ) : filteredWishlist.length === 0 ? (

                /* ================= EMPTY STATE ================= */

                <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">

                        <Heart
                            size={30}
                            className="text-purple-600"
                        />

                    </div>


                    <h2 className="mt-5 text-lg font-semibold text-gray-900">

                        {search
                            ? "No Books Found"
                            : "Your Wishlist is Empty"}

                    </h2>


                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">

                        {search
                            ? "Try searching with a different title, author, genre, or ISBN."
                            : "Save books that you want to read later. They will appear here."}

                    </p>


                    {!search && (

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/books")
                            }
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                        >

                            Browse Books

                            <ArrowRight size={16} />

                        </button>

                    )}

                </div>

            ) : (

                /* ================= BOOK GRID ================= */

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {filteredWishlist.map((item) => (

                        <WishlistCard
                            key={item.id}
                            item={item}
                            removing={
                                removingBookId === item.book?.id
                            }
                            onRemove={removeBook}
                            onView={() =>
                                navigate(
                                    `/books/${item.book?.id}`
                                )
                            }
                        />

                    ))}

                </div>

            )}

        </div>
    );
}


/* ============================================================
   WISHLIST CARD
============================================================ */

function WishlistCard({
    item,
    removing,
    onRemove,
    onView
}) {

    const book = item.book;


    if (!book) {
        return null;
    }


    const available =
        Number(book.availableCopies || 0) > 0;


    const totalCopies =
        Number(book.totalCopies || 0);


    const availableCopies =
        Number(book.availableCopies || 0);


    return (

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">


            {/* ================= COVER ================= */}

            <div className="relative flex h-64 items-center justify-center bg-[#f1f1f5] p-5">


                {book.coverImageUrl ? (

                    <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="h-full max-w-[155px] rounded-md object-cover shadow-md"
                    />

                ) : (

                    <div className="flex h-full w-[155px] items-center justify-center rounded-md bg-[#e5e5eb] shadow-md">

                        <Heart
                            size={40}
                            className="text-gray-300"
                        />

                    </div>

                )}


                {/* Availability */}

                <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold ${
                        available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                    }`}
                >

                    {available
                        ? "Available"
                        : "Checked Out"}

                </span>

            </div>


            {/* ================= INFORMATION ================= */}

            <div className="p-5">


                <div className="flex items-start justify-between gap-3">


                    <div className="min-w-0">

                        <h2 className="line-clamp-2 text-base font-semibold text-gray-900">
                            {book.title}
                        </h2>


                        <p className="mt-1 text-sm text-gray-500">
                            by {book.author}
                        </p>

                    </div>


                    <Heart
                        size={19}
                        className="shrink-0 fill-purple-600 text-purple-600"
                    />

                </div>


                {/* ================= GENRE ================= */}

                {book.genreName && (

                    <div className="mt-3">

                        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-medium text-purple-600">

                            {book.genreName}

                        </span>

                    </div>

                )}


                {/* ================= ISBN ================= */}

                {book.isbn && (

                    <p className="mt-3 text-xs text-gray-400">
                        ISBN: {book.isbn}
                    </p>

                )}


                {/* ================= COPIES ================= */}

                <p
                    className={`mt-1 text-xs font-medium ${
                        available
                            ? "text-green-600"
                            : "text-red-500"
                    }`}
                >

                    {availableCopies} / {totalCopies} copies available

                </p>


                {/* ================= SAVED DATE ================= */}

                {item.addedAt && (

                    <p className="mt-2 text-[11px] text-gray-400">
                        Added on {formatDate(item.addedAt)}
                    </p>

                )}


                {/* ================= NOTES ================= */}

                {item.notes && (

                    <div className="mt-3 rounded-md bg-[#f7f7fb] px-3 py-2">

                        <p className="text-[10px] font-medium text-gray-500">
                            Note
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                            {item.notes}
                        </p>

                    </div>

                )}


                {/* ================= ACTIONS ================= */}

                <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">


                    <button
                        type="button"
                        onClick={onView}
                        className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-700"
                    >

                        View Details

                        <ArrowRight size={14} />

                    </button>


                    <button
                        type="button"
                        disabled={removing}
                        onClick={() =>
                            onRemove(book.id)
                        }
                        className="flex w-11 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Remove from wishlist"
                    >

                        {removing ? (

                            <Loader2
                                size={17}
                                className="animate-spin"
                            />

                        ) : (

                            <Trash2 size={17} />

                        )}

                    </button>

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


    const parsedDate =
        new Date(date);


    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }


    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


export default Wishlist;