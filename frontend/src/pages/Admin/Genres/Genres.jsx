import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Plus,
    Pencil,
    Trash2,
    HardDrive,
    RefreshCw,
    Tags,
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
    LoadingState,
    ErrorState,
    Table,
    TextAreaField,
} from "../../../component/admin/AdminUI";

import { adminApi } from "../../../services/adminApi";

const blank = {
    code: "",
    name: "",
    description: "",
    displayOrder: 0,
    active: true,
    parentGenreId: "",
};

export default function Genres() {

    const [genres, setGenres] =
        useState([]);

    const [count, setCount] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [modal, setModal] =
        useState(null);

    const [form, setForm] =
        useState(blank);

    const [bookCount, setBookCount] =
        useState({});


    const load = async () => {

        setLoading(true);

        try {

            const [g, c] =
                await Promise.all([
                    adminApi.genres.list(),
                    adminApi.genres.count(),
                ]);

            setGenres(g);

            setCount(Number(c || 0));

            setError("");

            const counts = {};

            await Promise.all(
                g.map(async (x) => {

                    try {

                        counts[x.id] =
                            await adminApi.genres.bookCount(
                                x.id
                            );

                    } catch {}

                })
            );

            setBookCount(counts);

        } catch (e) {

            setError(
                e.response?.data?.message ||
                    "Unable to load genres."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        load();
    }, []);


    const openCreate = () => {

        setForm(blank);

        setModal("create");

    };


    const openEdit = (g) => {

        setForm({
            ...g,
            parentGenreId:
                g.parentGenreId ?? "",
        });

        setModal("edit");

    };


    const save = async (e) => {

        e.preventDefault();

        try {

            const payload = {
                ...form,
                displayOrder:
                    Number(
                        form.displayOrder || 0
                    ),
                parentGenreId:
                    form.parentGenreId
                        ? Number(
                              form.parentGenreId
                          )
                        : null,
            };

            if (modal === "create") {

                await adminApi.genres.create(
                    payload
                );

            } else {

                await adminApi.genres.update(
                    form.id,
                    payload
                );

            }

            setModal(null);

            await load();

        } catch (e) {

            alert(
                e.response?.data?.message ||
                    "Could not save genre."
            );

        }
    };


    const soft = async (g) => {

        if (
            !confirm(
                `Soft delete "${g.name}"?`
            )
        ) {
            return;
        }

        try {

            await adminApi.genres.softDelete(
                g.id
            );

            await load();

        } catch (e) {

            alert(
                e.response?.data?.message ||
                    "Delete failed."
            );

        }
    };


    const hard = async (g) => {

        if (
            !confirm(
                `PERMANENTLY delete "${g.name}"?`
            )
        ) {
            return;
        }

        try {

            await adminApi.genres.hardDelete(
                g.id
            );

            await load();

        } catch (e) {

            alert(
                e.response?.data?.message ||
                    "Permanent delete failed."
            );

        }
    };


    const options = useMemo(
        () =>
            genres
                .filter(
                    (g) =>
                        g.id !== form.id
                )
                .map((g) => ({
                    value: g.id,
                    label: `${
                        g.parentGenreName
                            ? `${g.parentGenreName} / `
                            : ""
                    }${g.name}`,
                })),
        [genres, form.id]
    );


    return (
        <AdminPage
            title="Genre Management"
            subtitle="Manage hierarchical genres and their catalogue relationships"
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
                        onClick={openCreate}
                    >
                        <Plus
                            size={13}
                            className="inline mr-1"
                        />
                        Add Genre
                    </Button>

                </div>
            }
        >

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">

                <StatCard
                    label="Active Genres"
                    value={count}
                    icon={Tags}
                />

                <StatCard
                    label="Top Level"
                    value={
                        genres.filter(
                            (g) =>
                                !g.parentGenreId
                        ).length
                    }
                    tone="blue"
                />

                <StatCard
                    label="Child Genres"
                    value={
                        genres.filter(
                            (g) =>
                                g.parentGenreId
                        ).length
                    }
                    tone="green"
                />

            </div>


            <AdminCard>

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
                                key: "name",
                                label: "Genre",
                                render: (r) => (
                                    <div>
                                        <p className="font-semibold">
                                            {r.name}
                                        </p>

                                        <p className="text-[9px] text-gray-400">
                                            {r.code}
                                        </p>
                                    </div>
                                ),
                            },

                            {
                                key: "parentGenreName",
                                label: "Parent",
                                render: (r) =>
                                    r.parentGenreName ||
                                    "Top Level",
                            },

                            {
                                key: "displayOrder",
                                label: "Order",
                            },

                            {
                                key: "bookCount",
                                label: "Books",
                                render: (r) =>
                                    bookCount[
                                        r.id
                                    ] ?? "—",
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
                                            className="text-purple-600"
                                            title="Edit"
                                            onClick={() =>
                                                openEdit(r)
                                            }
                                        >
                                            <Pencil
                                                size={14}
                                            />
                                        </button>

                                        <button
                                            className="text-red-500"
                                            title="Soft delete"
                                            onClick={() =>
                                                soft(r)
                                            }
                                        >
                                            <Trash2
                                                size={14}
                                            />
                                        </button>

                                        <button
                                            className="text-red-700"
                                            title="Hard delete"
                                            onClick={() =>
                                                hard(r)
                                            }
                                        >
                                            <HardDrive
                                                size={14}
                                            />
                                        </button>

                                    </div>
                                ),
                            },
                        ]}
                        rows={genres}
                    />
                )}

            </AdminCard>


            <Modal
                open={
                    modal === "create" ||
                    modal === "edit"
                }
                onClose={() => setModal(null)}
                title={
                    modal === "create"
                        ? "Add Genre"
                        : "Edit Genre"
                }
            >

                <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    onSubmit={save}
                >

                    <Field
                        label="Genre Code"
                        required
                        value={form.code}
                        onChange={(v) =>
                            setForm({
                                ...form,
                                code: v,
                            })
                        }
                    />

                    <Field
                        label="Name"
                        required
                        value={form.name}
                        onChange={(v) =>
                            setForm({
                                ...form,
                                name: v,
                            })
                        }
                    />

                    <SelectField
                        label="Parent Genre"
                        value={
                            form.parentGenreId
                        }
                        onChange={(v) =>
                            setForm({
                                ...form,
                                parentGenreId:
                                    v,
                            })
                        }
                        options={options}
                    />

                    <Field
                        label="Display Order"
                        type="number"
                        value={
                            form.displayOrder
                        }
                        onChange={(v) =>
                            setForm({
                                ...form,
                                displayOrder: v,
                            })
                        }
                    />

                    <div className="md:col-span-2">

                        <TextAreaField
                            label="Description"
                            value={
                                form.description
                            }
                            onChange={(v) =>
                                setForm({
                                    ...form,
                                    description:
                                        v,
                                })
                            }
                        />

                    </div>

                    <div className="md:col-span-2 flex justify-end">

                        <Button type="submit">
                            Save Genre
                        </Button>

                    </div>

                </form>

            </Modal>

        </AdminPage>
    );
}