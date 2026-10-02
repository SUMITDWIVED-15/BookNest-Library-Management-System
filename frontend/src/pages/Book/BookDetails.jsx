import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Star,
    Heart,
    Share2,
    Printer,
    BookOpen,
    CalendarDays,
    Tag,
    Library,
    Info,
} from "lucide-react";

import bookService from "../../services/bookService";
import reviewService from "../../services/reviewService";
import wishlistService from "../../services/wishlistService";
import reservationService from "../../services/reservationService";
import loanService from "../../services/loanService";

function BookDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("Reviews");

    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [wishlisted, setWishlisted] = useState(false);

    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    /*
     * Load book
     */
    useEffect(() => {
        const loadBook = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await bookService.getBookById(id);

                setBook(data);
            } catch (err) {
                console.error("Failed to load book:", err);
                setError("Unable to load this book.");
            } finally {
                setLoading(false);
            }
        };

        loadBook();
    }, [id]);

    /*
     * Load reviews
     */
    useEffect(() => {
        const loadReviews = async () => {
            try {
                setReviewsLoading(true);

                const response =
                    await reviewService.getReviewsByBook(id, {
                        page: 0,
                        size: 10,
                    });

                setReviews(response?.content ?? []);
            } catch (err) {
                console.error("Failed to load reviews:", err);
                setReviews([]);
            } finally {
                setReviewsLoading(false);
            }
        };

        loadReviews();
    }, [id]);

    const handleWishlist = async () => {
        try {
            setError("");
            setMessage("");

            if (wishlisted) {
                await wishlistService.removeFromWishlist(id);
                setWishlisted(false);
                setMessage("Book removed from wishlist.");
            } else {
                await wishlistService.addToWishlist(id);
                setWishlisted(true);
                setMessage("Book added to wishlist.");
            }
        } catch (err) {
            console.error("Wishlist error:", err);
            setError(
                err?.response?.data?.message ||
                "Unable to update wishlist."
            );
        }
    };

    const handleBorrow = async () => {
        try {
            setError("");
            setMessage("");

            await loanService.checkoutBook({
                bookId: Number(id),
                checkoutDays: 14,
                notes: null,
            });

            setMessage("Book borrowed successfully.");

            const updatedBook = await bookService.getBookById(id);
            setBook(updatedBook);
        } catch (err) {
            console.error("Borrow error:", err);
            setError(
                err?.response?.data?.message ||
                "Unable to borrow this book."
            );
        }
    };

    const handleReserve = async () => {
        try {
            setError("");
            setMessage("");

            await reservationService.createReservation({
                bookId: Number(id),
            });

            setMessage("Book reserved successfully.");

            /*
             * Refresh book so alreadyHaveReservation / availability
             * can reflect backend state.
             */
            const updatedBook =
                await bookService.getBookById(id);

            setBook(updatedBook);

        } catch (err) {
            console.error("Reservation error:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to reserve this book."
            );
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(
                window.location.href
            );

            setMessage("Book link copied.");
        } catch (err) {
            console.error("Share error:", err);
        }
    };

    if (loading) {
        return (
            <div className="h-full overflow-y-auto bg-[#f7f7fb]">

                <div className="border-b border-gray-200 bg-white px-6 py-5">
                    <h1 className="text-[18px] font-semibold text-[#171725]">
                        Browse Books
                    </h1>
                </div>

                <div className="flex min-h-[500px] items-center justify-center">
                    <div className="text-center">
                        <BookOpen
                            size={42}
                            className="mx-auto mb-3 animate-pulse text-gray-300"
                        />

                        <p className="text-sm text-gray-500">
                            Loading book details...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !book) {
        return (
            <div className="h-full overflow-y-auto bg-[#f7f7fb]">

                <div className="border-b border-gray-200 bg-white px-6 py-5">
                    <h1 className="text-[18px] font-semibold text-[#171725]">
                        Browse Books
                    </h1>
                </div>

                <div className="px-6 py-8 md:px-8">

                    <button
                        onClick={() => navigate("/books")}
                        className="mb-5 flex items-center gap-2 text-sm font-medium text-[#6957e8] hover:underline"
                    >
                        <ArrowLeft size={16} />
                        BACK TO BOOKS
                    </button>

                    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-600">
                        {error}
                    </div>

                </div>
            </div>
        );
    }

    if (!book) {
        return null;
    }

    const availableCopies = book.availableCopies ?? 0;
    const totalCopies = book.totalCopies ?? 0;
    const available = availableCopies > 0;

    const rating = Number(book.rating ?? 0);
    const reviewCount = Number(book.reviews ?? reviews.length);

    const image =
        book.coverImageUrl ||
        "https://via.placeholder.com/300x420?text=No+Cover";

    const genre =
        book.genreName ||
        book.genreCode ||
        "N/A";

    return (
        <div className="h-full overflow-y-auto bg-[#f7f7fb]">

            {/* Header */}
            <div className="border-b border-gray-200 bg-white px-6 py-5">
                <h1 className="text-[18px] font-semibold text-[#171725]">
                    Browse Books
                </h1>
            </div>

            <div className="px-6 py-6 md:px-8">

                {/* Back */}
                <button
                    onClick={() => navigate("/books")}
                    className="mb-5 flex items-center gap-2 text-sm font-medium text-[#6957e8] hover:underline"
                >
                    <ArrowLeft size={16} />
                    BACK TO BOOKS
                </button>

                {/* Message */}
                {message && (
                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Details Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">

                    <div className="flex flex-col gap-6 lg:flex-row">

                        {/* Book Cover */}
                        <div className="flex shrink-0 justify-center lg:w-[260px]">

                            <img
                                src={image}
                                alt={book.title}
                                className="h-[390px] w-[250px] rounded-lg object-cover shadow-md"
                            />

                        </div>

                        {/* Information */}
                        <div className="flex-1">

                            <h2 className="text-2xl font-bold text-[#171725] md:text-3xl">
                                {book.title}
                            </h2>

                            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                <User size={16} />
                                by {book.author}
                            </p>

                            {/* Rating */}
                            <div className="mt-3 flex items-center gap-2">

                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={17}
                                            className={
                                                star <= Math.round(rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>

                                <span className="text-sm text-gray-500">
                                    {rating}
                                </span>

                                <span className="text-sm text-gray-400">
                                    ({reviewCount} reviews)
                                </span>

                            </div>

                            {/* Status */}
                            <div className="mt-4">
                                <span
                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                        available
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-500"
                                    }`}
                                >
                                    {available
                                        ? "Currently Available"
                                        : "Currently Checked Out"}
                                </span>
                            </div>

                            {/* Information Grid */}
                            <div className="my-5 grid grid-cols-1 gap-5 border-y border-gray-200 py-5 sm:grid-cols-2">

                                <InfoItem
                                    icon={<Tag size={18} />}
                                    label="Genre"
                                    value={genre}
                                />

                                <InfoItem
                                    icon={<Library size={18} />}
                                    label="Publisher"
                                    value={book.publisher || "N/A"}
                                />

                                <InfoItem
                                    icon={<BookOpen size={18} />}
                                    label="ISBN"
                                    value={book.isbn}
                                />

                                <InfoItem
                                    icon={<CalendarDays size={18} />}
                                    label="Publication Date"
                                    value={
                                        book.publishedDate
                                            ? book.publishedDate
                                            : "N/A"
                                    }
                                />

                            </div>

                            {/* Copies */}
                            <p className="mb-4 text-sm text-gray-500">
                                <span className="font-semibold text-gray-700">
                                    Availability:
                                </span>{" "}
                                {availableCopies} / {totalCopies} copies
                                available
                            </p>

                            {/* About */}
                            <h3 className="text-lg font-semibold text-[#171725]">
                                About This Book
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                {book.description ||
                                    "No description available."}
                            </p>

                            {/* Reserve / Borrow */}
                            <button
                                disabled={
                                    book.alreadyHaveReservation ||
                                    book.alreadyHaveLoan
                                }
                                onClick={available ? handleBorrow : handleReserve}
                                className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white transition ${
                                    book.alreadyHaveReservation || book.alreadyHaveLoan
                                        ? "cursor-not-allowed bg-gray-400"
                                        : "bg-[#6957e8] hover:bg-[#5846d6]"
                                }`}
                            >
                                {book.alreadyHaveReservation
                                    ? "RESERVED"
                                    : book.alreadyHaveLoan
                                        ? "BORROWED"
                                        : available
                                            ? "BORROW BOOK"
                                            : "RESERVE BOOK"}
                            </button>

                            {/* Actions */}
                            <div className="mt-2 grid grid-cols-3 gap-2">

                                <button
                                    onClick={handleWishlist}
                                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                    title="Wishlist"
                                >
                                    <Heart
                                        size={17}
                                        className={
                                            wishlisted
                                                ? "fill-red-500 text-red-500"
                                                : ""
                                        }
                                    />
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                    title="Share"
                                >
                                    <Share2 size={17} />
                                </button>

                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                    title="Print"
                                >
                                    <Printer size={17} />
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-6 border-b border-gray-200 bg-white px-5">

                    <div className="flex gap-7">

                        {[
                            "Reviews",
                            "Related Books",
                            "Loan History",
                        ].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`border-b-2 px-1 py-4 text-sm font-medium ${
                                    activeTab === tab
                                        ? "border-[#6957e8] text-[#6957e8]"
                                        : "border-transparent text-gray-500"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}

                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white px-5 py-6">

                    {activeTab === "Reviews" && (
                        <Reviews
                            reviews={reviews}
                            loading={reviewsLoading}
                            bookId={book.id}
                            onReviewCreated={(review) =>
                                setReviews((current) => [review, ...current])
                            }
                        />
                    )}

                    {activeTab === "Related Books" && (
                        <RelatedBooks
                            currentBookId={book.id}
                        />
                    )}

                    {activeTab === "Loan History" && (
                        <LoanHistory currentBookId={book.id} />
                    )}

                </div>

            </div>
        </div>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">

            <div className="mt-0.5 text-[#6957e8]">
                {icon}
            </div>

            <div>
                <p className="text-xs text-gray-400">
                    {label}
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#171725]">
                    {value}
                </p>
            </div>

        </div>
    );
}

function Reviews({
    reviews,
    loading,
    bookId,
    onReviewCreated,
}) {
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [form, setForm] = useState({
        rating: 5,
        title: "",
        reviewText: "",
    });

    const handleSubmitReview = async (event) => {
        event.preventDefault();
        setFormError("");

        if (form.reviewText.trim().length < 10) {
            setFormError("Review must contain at least 10 characters.");
            return;
        }

        try {
            setSubmitting(true);

            const review = await reviewService.createReview({
                bookId: Number(bookId),
                rating: Number(form.rating),
                title: form.title.trim() || null,
                reviewText: form.reviewText.trim(),
            });

            onReviewCreated?.(review);
            setForm({ rating: 5, title: "", reviewText: "" });
            setShowForm(false);
        } catch (err) {
            setFormError(
                err?.response?.data?.message ||
                "Unable to submit your review."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <h2 className="text-lg font-semibold text-[#171725]">
                        Reader Reviews
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        See what others are saying about this book
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setFormError("");
                        setShowForm((value) => !value);
                    }}
                    className="rounded-md bg-[#6957e8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5846d6]"
                >
                    {showForm ? "CLOSE REVIEW" : "WRITE A REVIEW"}
                </button>

            </div>

            {showForm && (
                <form
                    onSubmit={handleSubmitReview}
                    className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5"
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="text-xs font-medium text-gray-600">
                            Rating
                            <select
                                value={form.rating}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        rating: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                            >
                                {[5, 4, 3, 2, 1].map((value) => (
                                    <option key={value} value={value}>
                                        {value} / 5
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="text-xs font-medium text-gray-600">
                            Review Title
                            <input
                                value={form.title}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        title: event.target.value,
                                    }))
                                }
                                maxLength={200}
                                className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                            />
                        </label>
                    </div>

                    <label className="mt-4 block text-xs font-medium text-gray-600">
                        Review
                        <textarea
                            value={form.reviewText}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    reviewText: event.target.value,
                                }))
                            }
                            minLength={10}
                            maxLength={2000}
                            rows={4}
                            className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                            placeholder="Write at least 10 characters"
                        />
                    </label>

                    {formError && (
                        <p className="mt-2 text-xs text-red-600">{formError}</p>
                    )}

                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-md bg-[#6957e8] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                        >
                            {submitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
                        </button>
                    </div>
                </form>
            )}

            {/* Information message */}
            <div className="mt-5 flex gap-3 rounded-lg bg-[#e5f7fc] px-4 py-3 text-sm text-[#1687a7]">

                <Info size={18} className="mt-0.5 shrink-0" />

                <p>
                    <strong>Want to write a review?</strong>{" "}
                    You can review this book after you've checked it
                    out and returned it.
                </p>

            </div>

            {/* Community Reviews */}
            <h3 className="mt-7 text-sm font-semibold text-[#171725]">
                Community Reviews ({reviews.length})
            </h3>

            {loading ? (

                <div className="mt-4 rounded-xl border border-gray-200 py-10 text-center">
                    <p className="text-sm text-gray-500">
                        Loading reviews...
                    </p>
                </div>

            ) : reviews.length > 0 ? (

                <div className="mt-4 space-y-4">

                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="rounded-xl border border-gray-200 p-5"
                        >

                            <div className="flex items-start gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6957e8] text-sm font-semibold text-white">
                                    {(
                                        review.userName ||
                                        "U"
                                    ).charAt(0).toUpperCase()}
                                </div>

                                <div className="min-w-0 flex-1">

                                    <div className="flex flex-col justify-between gap-2 sm:flex-row">

                                        <div>

                                            <p className="text-sm font-semibold text-[#171725]">
                                                {review.userName ||
                                                    "User"}
                                            </p>

                                            <div className="mt-1 flex">

                                                {[1, 2, 3, 4, 5].map(
                                                    (star) => (
                                                        <Star
                                                            key={star}
                                                            size={14}
                                                            className={
                                                                star <=
                                                                Number(
                                                                    review.rating
                                                                )
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-gray-300"
                                                            }
                                                        />
                                                    )
                                                )}

                                            </div>
                                        </div>

                                        <span className="text-xs text-gray-400">
                                            {review.createdAt || ""}
                                        </span>

                                    </div>

                                    {review.title && (
                                        <p className="mt-3 text-sm font-semibold text-[#171725]">
                                            {review.title}
                                        </p>
                                    )}

                                    <p className="mt-2 text-sm leading-6 text-gray-600">
                                        {review.reviewText}
                                    </p>

                                </div>
                            </div>
                        </div>
                    ))}

                </div>

            ) : (

                <div className="mt-4 rounded-xl border border-dashed border-gray-300 py-12 text-center">

                    <Star
                        size={35}
                        className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="text-sm text-gray-500">
                        No reviews yet.
                    </p>

                </div>
            )}

        </div>
    );
}

function RelatedBooks({ currentBookId }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRelated = async () => {
            try {
                setLoading(true);
                const current = await bookService.getBookById(currentBookId);
                const response = await bookService.getBooks({
                    genreId: current?.genreId || undefined,
                    activeOnly: true,
                    availableOnly: false,
                    page: 0,
                    size: 6,
                    sortBy: "createdAt",
                    sortDirection: "DESC",
                });

                setBooks(
                    (response?.content || []).filter(
                        (book) => Number(book.id) !== Number(currentBookId)
                    )
                );
            } catch (err) {
                console.error("Failed to load related books:", err);
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };

        loadRelated();
    }, [currentBookId]);

    return (
        <div>
            <h2 className="text-lg font-semibold text-[#171725]">
                Related Books
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                More books you may be interested in
            </p>

            {loading ? (
                <div className="mt-6 rounded-xl border border-gray-200 py-12 text-center text-sm text-gray-500">
                    Loading related books...
                </div>
            ) : books.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-gray-300 py-12 text-center">
                    <BookOpen size={35} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">
                        No related books found.
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {books.map((book) => (
                        <button
                            key={book.id}
                            type="button"
                            onClick={() => (window.location.href = `/books/${book.id}`)}
                            className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-purple-200 hover:shadow-sm"
                        >
                            <div className="flex gap-3">
                                <img
                                    src={book.coverImageUrl || "https://via.placeholder.com/80x110?text=No+Cover"}
                                    alt={book.title || "Book cover"}
                                    className="h-24 w-16 rounded object-cover"
                                />
                                <div className="min-w-0">
                                    <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                                        {book.title}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {book.author || "Unknown author"}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function LoanHistory({ currentBookId }) {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                setLoading(true);
                const response = await loanService.getMyLoans({
                    page: 0,
                    size: 100,
                });

                setLoans(
                    (response?.content || []).filter(
                        (loan) => Number(loan.bookId) === Number(currentBookId)
                    )
                );
            } catch (err) {
                console.error("Failed to load loan history:", err);
                setLoans([]);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, [currentBookId]);

    return (
        <div>
            <h2 className="text-lg font-semibold text-[#171725]">
                Loan History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                Your borrowing history for this book
            </p>

            {loading ? (
                <div className="mt-6 rounded-xl border border-gray-200 py-12 text-center text-sm text-gray-500">
                    Loading loan history...
                </div>
            ) : loans.length === 0 ? (
                <div className="mt-6 rounded-lg border border-dashed border-gray-300 py-12 text-center">
                    <BookOpen size={35} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">
                        No loan history for this book.
                    </p>
                </div>
            ) : (
                <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full text-left text-xs">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Checkout Date</th>
                                <th className="px-4 py-3">Due Date</th>
                                <th className="px-4 py-3">Return Date</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan) => (
                                <tr key={loan.id} className="border-t border-gray-100">
                                    <td className="px-4 py-3">{loan.checkoutDate || "-"}</td>
                                    <td className="px-4 py-3">{loan.dueDate || "-"}</td>
                                    <td className="px-4 py-3">{loan.returnDate || "-"}</td>
                                    <td className="px-4 py-3 font-semibold">{loan.status || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default BookDetails;