import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    ChevronDown,
    BookOpen,
    Star,
} from "lucide-react";

import bookService from "../../services/bookService";
import genreService from "../../services/genreService";

function Books() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);

    const [search, setSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All Genres");
    const [selectedGenreId, setSelectedGenreId] = useState(null);
    const [sortBy, setSortBy] = useState("Newest First");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /*
     * Load genres once
     */
    useEffect(() => {
        const loadGenres = async () => {
            try {
                const response = await genreService.getAllGenres();

                const content = response?.content ?? response ?? [];

                setGenres(Array.isArray(content) ? content : []);
            } catch (err) {
                console.error("Failed to load genres:", err);
                setGenres([]);
            }
        };

        loadGenres();
    }, []);

    /*
     * Load books whenever search / genre / sorting changes
     */
    useEffect(() => {
        const loadBooks = async () => {
            try {
                setLoading(true);
                setError("");

                let sortField = "createdAt";
                let sortDirection = "DESC";

                if (sortBy === "Title A-Z") {
                    sortField = "title";
                    sortDirection = "ASC";
                }

                if (sortBy === "Title Z-A") {
                    sortField = "title";
                    sortDirection = "DESC";
                }

                if (sortBy === "Highest Rated") {
                    /*
                     * Backend BookDTO does not expose a rating field.
                     * Keep backend's createdAt ordering for now.
                     */
                    sortField = "createdAt";
                    sortDirection = "DESC";
                }

                const response = await bookService.getBooks({
                    searchTerm: search || undefined,
                    genreId: selectedGenreId || undefined,
                    availableOnly: false,
                    activeOnly: true,
                    page: 0,
                    size: 10,
                    sortBy: sortField,
                    sortDirection,
                });

                setBooks(response?.content ?? []);
            } catch (err) {
                console.error("Failed to load books:", err);
                setBooks([]);
                setError("Unable to load books. Please check the backend.");
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, [search, selectedGenreId, sortBy]);

    const displayGenres = useMemo(() => {
        return [
            {
                id: null,
                name: "All Genres",
            },
            ...genres.map((genre) => ({
                id: genre.id,
                name:
                    genre.name ||
                    genre.genreName ||
                    genre.code ||
                    genre.genreCode ||
                    "Unknown Genre",
            })),
        ];
    }, [genres]);

    const handleGenreChange = (genre) => {
        setSelectedGenre(genre.name);
        setSelectedGenreId(genre.id);
    };

    return (
        <div className="h-full overflow-y-auto bg-[#f7f7fb]">

            {/* Top Page Header */}
            <div className="border-b border-gray-200 bg-white px-6 py-5">
                <h1 className="text-[18px] font-semibold text-[#171725]">
                    Browse Books
                </h1>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8 md:px-8">

                {/* Heading */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-[#171725]">
                        Browse Our{" "}
                        <span className="text-[#6957e8]">
                            Collection
                        </span>
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Discover thousands of books across all genres
                    </p>
                </div>

                {/* Search + Sort */}
                <div className="mb-7 flex flex-col gap-4 lg:flex-row">

                    {/* Search */}
                    <div className="relative flex-1">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, author or ISBN..."
                            className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#6957e8] focus:ring-1 focus:ring-[#6957e8]"
                        />
                    </div>

                    {/* Sort */}
                    <div className="relative w-full lg:w-52">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 outline-none focus:border-[#6957e8]"
                        >
                            <option>Newest First</option>
                            <option>Title A-Z</option>
                            <option>Title Z-A</option>
                            <option>Highest Rated</option>
                        </select>

                        <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>
                </div>

                {/* Browse Area */}
                <div className="flex gap-7">

                    {/* Genres */}
                    <aside className="hidden w-56 shrink-0 md:block">
                        <div className="rounded-xl border border-gray-200 bg-white p-5">

                            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#171725]">
                                <BookOpen
                                    size={17}
                                    className="text-[#6957e8]"
                                />
                                Genres
                            </h3>

                            <div className="max-h-[520px] space-y-1 overflow-y-auto pr-1">

                                {displayGenres.map((genre) => (
                                    <button
                                        key={genre.id ?? "all"}
                                        onClick={() =>
                                            handleGenreChange(genre)
                                        }
                                        className={`w-full rounded-md px-3 py-2.5 text-left text-sm transition ${
                                            selectedGenre === genre.name
                                                ? "bg-[#eeeafd] font-semibold text-[#6957e8]"
                                                : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {genre.name}
                                    </button>
                                ))}

                            </div>
                        </div>
                    </aside>

                    {/* Books Section */}
                    <section className="min-w-0 flex-1">

                        {/* Results */}
                        <div className="mb-5 flex items-center justify-between">

                            <p className="text-sm text-gray-500">
                                {loading
                                    ? "Loading books..."
                                    : `${books.length} books found`}
                            </p>

                            {selectedGenre !== "All Genres" && (
                                <button
                                    onClick={() => {
                                        setSelectedGenre("All Genres");
                                        setSelectedGenreId(null);
                                    }}
                                    className="text-sm font-medium text-[#6957e8] hover:underline"
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Loading */}
                        {loading ? (
                            <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
                                <BookOpen
                                    size={42}
                                    className="mx-auto mb-3 animate-pulse text-gray-300"
                                />

                                <p className="text-sm text-gray-500">
                                    Loading books...
                                </p>
                            </div>
                        ) : books.length > 0 ? (

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                                {books.map((book) => (
                                    <BookCard
                                        key={book.id}
                                        book={book}
                                        onViewDetails={() =>
                                            navigate(`/books/${book.id}`)
                                        }
                                    />
                                ))}

                            </div>

                        ) : (

                            <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">

                                <BookOpen
                                    size={42}
                                    className="mx-auto mb-3 text-gray-300"
                                />

                                <h3 className="font-semibold text-gray-700">
                                    No books found
                                </h3>

                                <p className="mt-1 text-sm text-gray-400">
                                    Try a different search or genre.
                                </p>

                            </div>
                        )}

                    </section>
                </div>
            </div>
        </div>
    );
}

function BookCard({ book, onViewDetails }) {

    const availableCopies = book.availableCopies ?? 0;
    const totalCopies = book.totalCopies ?? 0;
    const available = availableCopies > 0;

    const rating = Number(book.rating ?? 0);
    const reviews = Number(book.reviews ?? 0);

    const image =
        book.coverImageUrl ||
        "https://via.placeholder.com/300x420?text=No+Cover";

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">

            {/* Book Cover */}
            <div className="relative flex h-64 items-center justify-center bg-[#f1f1f5] p-4">

                <img
                    src={image}
                    alt={book.title}
                    className="h-full max-w-[155px] rounded-md object-cover shadow-md"
                />

                {/* Availability */}
                <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold ${
                        available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                    }`}
                >
                    {available ? "Available" : "Checked Out"}
                </span>
            </div>

            {/* Book Information */}
            <div className="p-5">

                <h3 className="line-clamp-1 text-[17px] font-semibold text-[#171725]">
                    {book.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    by {book.author}
                </p>

                {/* Rating */}
                <div className="mt-3 flex items-center gap-1.5">

                    <div className="flex items-center">
                        <Star
                            size={14}
                            className={
                                rating > 0
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                            }
                        />

                        <span className="ml-1 text-xs font-medium text-gray-600">
                            {rating}
                        </span>
                    </div>

                    <span className="text-xs text-gray-400">
                        ({reviews} reviews)
                    </span>
                </div>

                {/* ISBN */}
                <p className="mt-3 text-xs text-gray-400">
                    ISBN: {book.isbn}
                </p>

                {/* Copies */}
                <p
                    className={`mt-1 text-xs font-medium ${
                        available
                            ? "text-green-600"
                            : "text-red-500"
                    }`}
                >
                    {availableCopies} / {totalCopies} copies available
                </p>

                {/* Description */}
                <p className="mt-3 line-clamp-2 text-sm leading-5 text-gray-500">
                    {book.description || "No description available."}
                </p>

                {/* View Details */}
                <button
                    onClick={onViewDetails}
                    className="mt-4 w-full rounded-lg bg-[#6957e8] py-2.5 text-sm font-semibold text-white transition hover:bg-[#5846d6]"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

export default Books;