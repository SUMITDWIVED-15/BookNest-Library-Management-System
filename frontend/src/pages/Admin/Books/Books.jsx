import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Upload,
    Eye,
    RefreshCw,
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

const blank = {
    isbn: "",
    title: "",
    author: "",
    genreId: "",
    publisher: "",
    publishedDate: "",
    language: "",
    pages: "",
    description: "",
    totalCopies: 1,
    availableCopies: 1,
    price: "",
    coverImageUrl: "",
    active: true,
};

export default function Books() {

    const [searchParams] = useSearchParams();

    const [data, setData] = useState({
        content: [],
        totalPages: 1,
        totalElements: 0,
    });

    const [genres, setGenres] = useState([]);

    const [stats, setStats] = useState({
        totalActiveBooks: 0,
        totalAvailableBooks: 0,
    });

    const [query, setQuery] = useState(() => searchParams.get("search") || "");

    const [page, setPage] = useState(0);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [modal, setModal] = useState(null);

    const [selected, setSelected] = useState(null);

    const [form, setForm] = useState(blank);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const urlQuery = searchParams.get("search") || "";
        if (urlQuery !== query) {
            setQuery(urlQuery);
            setPage(0);
        }
    }, [searchParams]);

    const load = async () => {

        setLoading(true);
        setError("");

        try {

            const [books, gs, s] =
                await Promise.all([
                    query.trim()
                        ? adminApi.books.search({
                              searchTerm:
                                  query.trim(),
                              page,
                              size: 10,
                              sortBy: "createdAt",
                              sortDirection: "DESC",
                          })
                        : adminApi.books.list({
                              page,
                              size: 10,
                              activeOnly: false,
                              sortBy: "createdAt",
                              sortDirection: "DESC",
                          }),

                    adminApi.genres.list(),

                    adminApi.books.stats(),
                ]);

            setData(books);
            setGenres(gs);
            setStats(s);

        } catch (e) {

            setError(
                e.response?.data?.message ||
                    "Unable to load books."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        load();
    }, [page]);


    const openCreate = () => {
        setForm(blank);
        setModal("create");
    };


    const openEdit = (b) => {

        setForm({
            ...b,
            genreId: b.genreId ?? "",
            publishedDate:
                b.publishedDate || "",
            pages: b.pages ?? "",
            price: b.price ?? "",
        });

        setModal("edit");
    };


    const save = async (e) => {

        e.preventDefault();

        setSaving(true);

        try {

            const payload = {
                ...form,
                genreId: Number(form.genreId),
                pages: form.pages
                    ? Number(form.pages)
                    : null,
                totalCopies:
                    Number(form.totalCopies),
                availableCopies:
                    Number(form.availableCopies),
                price:
                    form.price === ""
                        ? 0
                        : Number(form.price),
            };

            if (modal === "create") {

                await adminApi.books.create(
                    payload
                );

            } else {

                await adminApi.books.update(
                    form.id,
                    payload
                );

            }

            setModal(null);

            await load();

        } catch (e) {

            alert(
                e.response?.data?.message ||
                    "Could not save book."
            );

        } finally {

            setSaving(false);

        }
    };


    const softDelete = async (b) => {

        if (
            !window.confirm(
                `Soft delete "${b.title}"?`
            )
        ) {
            return;
        }

        try {

            await adminApi.books.softDelete(
                b.id
            );

            await load();

        } catch (e) {

            alert(
                e.response?.data?.message ||
                    "Delete failed."
            );

        }
    };


    const hardDelete = async (b) => {

        if (
            !window.confirm(
                `PERMANENTLY delete "${b.title}"? This cannot be undone.`
            )
        ) {
            return;
        }

        try {

            await adminApi.books.hardDelete(
                b.id
            );

            await load();

        } catch (e) {

            alert(
                e.response?.data?.message ||
                    "Permanent delete failed."
            );

        }
    };


    return (
        <AdminPage
            title="Book Management"
            subtitle="Manage books, inventory, availability and catalogue records"
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

                    <Button onClick={openCreate}>
                        <Plus
                            size={14}
                            className="inline mr-1"
                        />
                        Add Book
                    </Button>

                </div>
            }
        >

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

                <StatCard
                    label="Total Active Books"
                    value={
                        stats.totalActiveBooks ??
                        0
                    }
                />

                <StatCard
                    label="Available Copies"
                    value={
                        stats.totalAvailableBooks ??
                        0
                    }
                />

            </div>


            <AdminCard>

                <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-gray-100">

                    <div className="flex gap-2 w-full md:w-auto">

                        <div className="relative w-full md:w-80">

                            <Search
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                value={query}
                                onChange={(e) => {
                                    setQuery(
                                        e.target.value
                                    );
                                    setPage(0);
                                }}
                                onKeyDown={(e) =>
                                    e.key ===
                                        "Enter" &&
                                    load()
                                }
                                placeholder="Search title, author or ISBN"
                                className="w-full h-10 pl-9 pr-3 border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-400"
                            />

                        </div>

                        <Button
                            variant="secondary"
                            onClick={() => {
                                setPage(0);
                                load();
                            }}
                        >
                            Search
                        </Button>

                    </div>


                    <Button
                        variant="secondary"
                        onClick={() =>
                            setModal("bulk")
                        }
                    >
                        <Upload
                            size={14}
                            className="inline mr-1"
                        />
                        Bulk Add
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
                                key: "title",
                                label: "Book",
                                render: (r) => (
                                    <div className="max-w-[240px]">
                                        <p className="font-semibold truncate">
                                            {r.title}
                                        </p>

                                        <p className="text-[9px] text-gray-400 truncate">
                                            {r.author}
                                        </p>
                                    </div>
                                ),
                            },

                            {
                                key: "isbn",
                                label: "ISBN",
                            },

                            {
                                key: "genreName",
                                label: "Genre",
                            },

                            {
                                key: "totalCopies",
                                label: "Copies",
                            },

                            {
                                key: "availableCopies",
                                label: "Available",
                            },

                            {
                                key: "active",
                                label: "Status",
                                render: (r) => (
                                    <StatusBadge
                                        value={
                                            r.active
                                                ? "ACTIVE"
                                                : "INACTIVE"
                                        }
                                    />
                                ),
                            },

                            {
                                key: "actions",
                                label: "Actions",
                                render: (r) => (
                                    <div className="flex gap-2">

                                        <button
                                            title="View"
                                            onClick={() => {
                                                setSelected(r);
                                                setModal(
                                                    "view"
                                                );
                                            }}
                                            className="text-gray-500"
                                        >
                                            <Eye size={14} />
                                        </button>

                                        <button
                                            title="Edit"
                                            onClick={() =>
                                                openEdit(r)
                                            }
                                            className="text-purple-600"
                                        >
                                            <Pencil size={14} />
                                        </button>

                                        <button
                                            title="Soft delete"
                                            onClick={() =>
                                                softDelete(r)
                                            }
                                            className="text-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        <button
                                            title="Permanent delete"
                                            onClick={() =>
                                                hardDelete(r)
                                            }
                                            className="text-red-700 text-[9px] font-bold"
                                        >
                                            P
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
                open={
                    modal === "create" ||
                    modal === "edit"
                }
                onClose={() => setModal(null)}
                title={
                    modal === "create"
                        ? "Add Book"
                        : "Edit Book"
                }
            >
                <BookForm
                    form={form}
                    setForm={setForm}
                    genres={genres}
                    onSubmit={save}
                    saving={saving}
                />
            </Modal>


            <Modal
                open={modal === "bulk"}
                onClose={() => setModal(null)}
                title="Bulk Add Books"
                width="max-w-3xl"
            >
                <BulkForm
                    onDone={async () => {
                        setModal(null);
                        await load();
                    }}
                />
            </Modal>


            <Modal
                open={modal === "view"}
                onClose={() => setModal(null)}
                title="Book Details"
            >
                <BookView book={selected} />
            </Modal>

        </AdminPage>
    );
}


function BookForm({
    form,
    setForm,
    genres,
    onSubmit,
    saving,
}) {

    const set = (k, v) =>
        setForm((f) => ({
            ...f,
            [k]: v,
        }));

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >

            <Field
                label="ISBN"
                required
                value={form.isbn}
                onChange={(v) =>
                    set("isbn", v)
                }
            />

            <Field
                label="Title"
                required
                value={form.title}
                onChange={(v) =>
                    set("title", v)
                }
            />

            <Field
                label="Author"
                required
                value={form.author}
                onChange={(v) =>
                    set("author", v)
                }
            />

            <SelectField
                label="Genre"
                required
                value={form.genreId}
                onChange={(v) =>
                    set("genreId", v)
                }
                options={genres.map((g) => ({
                    value: g.id,
                    label: g.name,
                }))}
            />

            <Field
                label="Publisher"
                value={form.publisher}
                onChange={(v) =>
                    set("publisher", v)
                }
            />

            <Field
                label="Published Date"
                type="date"
                value={form.publishedDate}
                onChange={(v) =>
                    set("publishedDate", v)
                }
            />

            <Field
                label="Language"
                value={form.language}
                onChange={(v) =>
                    set("language", v)
                }
            />

            <Field
                label="Pages"
                type="number"
                value={form.pages}
                onChange={(v) =>
                    set("pages", v)
                }
            />

            <Field
                label="Total Copies"
                type="number"
                value={form.totalCopies}
                onChange={(v) =>
                    set("totalCopies", v)
                }
            />

            <Field
                label="Available Copies"
                type="number"
                value={form.availableCopies}
                onChange={(v) =>
                    set("availableCopies", v)
                }
            />

            <Field
                label="Price"
                type="number"
                value={form.price}
                onChange={(v) =>
                    set("price", v)
                }
            />

            <Field
                label="Cover Image URL"
                value={form.coverImageUrl}
                onChange={(v) =>
                    set("coverImageUrl", v)
                }
            />

            <div className="md:col-span-2">

                <TextAreaField
                    label="Description"
                    value={form.description}
                    onChange={(v) =>
                        set("description", v)
                    }
                />

            </div>

            <div className="md:col-span-2 flex justify-end">

                <Button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : "Save Book"}
                </Button>

            </div>

        </form>
    );
}


function BulkForm({ onDone }) {

    const [text, setText] =
        useState(`[
  {"isbn":"", "title":"", "author":"", "genreId":1, "totalCopies":1, "availableCopies":1}
]`);

    const [saving, setSaving] =
        useState(false);

    return (
        <div>

            <p className="text-[10px] text-gray-500 mb-3">
                Paste a JSON array using BookDTO fields.
                Required fields include isbn, title,
                author, genreId, totalCopies and
                availableCopies.
            </p>

            <textarea
                rows="15"
                value={text}
                onChange={(e) =>
                    setText(e.target.value)
                }
                className="w-full border border-gray-200 rounded-lg p-3 text-xs font-mono outline-none focus:border-purple-400"
            />

            <div className="flex justify-end mt-4">

                <Button
                    disabled={saving}
                    onClick={async () => {

                        try {

                            setSaving(true);

                            await adminApi.books.bulkCreate(
                                JSON.parse(text)
                            );

                            await onDone();

                        } catch (e) {

                            alert(
                                e.response?.data?.message ||
                                    e.message ||
                                    "Invalid JSON"
                            );

                        } finally {

                            setSaving(false);

                        }
                    }}
                >
                    {saving
                        ? "Creating..."
                        : "Create Books"}
                </Button>

            </div>

        </div>
    );
}


function BookView({ book }) {

    if (!book) {
        return null;
    }

    return (
        <div className="grid grid-cols-2 gap-4 text-xs">

            {[
                "id",
                "isbn",
                "title",
                "author",
                "genreName",
                "publisher",
                "publishedDate",
                "language",
                "pages",
                "totalCopies",
                "availableCopies",
                "price",
                "active",
            ].map((k) => (
                <div key={k}>

                    <p className="text-[9px] uppercase text-gray-400">
                        {k}
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                        {String(
                            book[k] ?? "—"
                        )}
                    </p>

                </div>
            ))}

            <div className="col-span-2">

                <p className="text-[9px] uppercase text-gray-400">
                    Description
                </p>

                <p className="mt-1 text-gray-700">
                    {book.description || "—"}
                </p>

            </div>

        </div>
    );
}