import { useEffect, useState } from "react";

import {
    Plus,
    Pencil,
    Trash2,
    RefreshCw,
    Star,
} from "lucide-react";

import {
    AdminPage,
    AdminCard,
    StatCard,
    Button,
    Modal,
    Field,
    StatusBadge,
    LoadingState,
    ErrorState,
    Table,
    TextAreaField,
} from "../../../component/admin/AdminUI";

import { adminApi } from "../../../services/adminApi";

const blank = {
    planCode: "",
    name: "",
    description: "",
    durationDays: 30,
    price: 0,
    currency: "INR",
    maxBooksAllowed: 1,
    maxDaysPerBook: 14,
    displayOrder: 0,
    isActive: true,
    isFeatured: false,
    badgeText: "",
    adminNotes: "",
};

export default function SubscriptionPlans({ onBack }) {

    const [plans, setPlans] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [modal, setModal] =
        useState(null);

    const [form, setForm] =
        useState(blank);


    const load = async () => {

        setLoading(true);

        try {

            setPlans(
                await adminApi.plans.list()
            );

            setError("");

        } catch (e) {

            setError(
                e.response?.data?.message ||
                    "Unable to load subscription plans."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        load();
    }, []);


    const save = async (e) => {

        e.preventDefault();

        try {

            const payload = {
                ...form,

                durationDays:
                    Number(
                        form.durationDays
                    ),

                price:
                    Number(
                        form.price || 0
                    ),

                maxBooksAllowed:
                    Number(
                        form.maxBooksAllowed
                    ),

                maxDaysPerBook:
                    Number(
                        form.maxDaysPerBook
                    ),

                displayOrder:
                    Number(
                        form.displayOrder ||
                            0
                    ),
            };

            if (modal === "create") {

                await adminApi.plans.create(
                    payload
                );

            } else {

                await adminApi.plans.update(
                    form.id,
                    payload
                );

            }

            setModal(null);

            await load();

        } catch (e) {

            alert(
                e.response?.data?.message ||
                    "Could not save plan."
            );

        }
    };


    const del = async (p) => {

        if (
            !confirm(
                `Delete plan "${p.name}"?`
            )
        ) {
            return;
        }

        try {

            await adminApi.plans.delete(
                p.id
            );

            await load();

        } catch (e) {

            alert(
                e.response?.data?.message ||
                    "Delete failed."
            );

        }
    };


    return (
        <AdminPage
            title="Subscription Plans"
            subtitle="Create and maintain membership plans"
            action={
                <div className="flex flex-wrap gap-2">

                    {onBack && (
                        <Button
                            variant="secondary"
                            onClick={onBack}
                        >
                            Back to Subscriptions
                        </Button>
                    )}

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
                        onClick={() => {
                            setForm(blank);
                            setModal("create");
                        }}
                    >
                        <Plus
                            size={13}
                            className="inline mr-1"
                        />
                        Add Plan
                    </Button>

                </div>
            }
        >

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">

                <StatCard
                    label="Plans"
                    value={plans.length}
                    icon={Star}
                />

                <StatCard
                    label="Active Plans"
                    value={
                        plans.filter(
                            (x) =>
                                x.isActive
                        ).length
                    }
                    tone="green"
                />

                <StatCard
                    label="Featured Plans"
                    value={
                        plans.filter(
                            (x) =>
                                x.isFeatured
                        ).length
                    }
                    tone="purple"
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
                                key: "planCode",
                                label: "Code",
                            },

                            {
                                key: "name",
                                label: "Plan",
                                render: (r) => (
                                    <div>
                                        <p className="font-semibold">
                                            {r.name}
                                        </p>

                                        <p className="text-[9px] text-gray-400">
                                            {r.description}
                                        </p>
                                    </div>
                                ),
                            },

                            {
                                key: "durationDays",
                                label: "Duration",
                            },

                            {
                                key: "price",
                                label: "Price",
                                render: (r) =>
                                    `${
                                        r.currency ||
                                        "INR"
                                    } ${
                                        r.price ??
                                        0
                                    }`,
                            },

                            {
                                key: "maxBooksAllowed",
                                label: "Max Books",
                            },

                            {
                                key: "maxDaysPerBook",
                                label: "Max Days",
                            },

                            {
                                key: "isActive",
                                label: "Status",
                                render: (r) => (
                                    <StatusBadge
                                        value={
                                            r.isActive
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
                                            onClick={() => {
                                                setForm({
                                                    ...r,
                                                });

                                                setModal(
                                                    "edit"
                                                );
                                            }}
                                        >
                                            <Pencil
                                                size={14}
                                            />
                                        </button>

                                        <button
                                            className="text-red-500"
                                            onClick={() =>
                                                del(r)
                                            }
                                        >
                                            <Trash2
                                                size={14}
                                            />
                                        </button>

                                    </div>
                                ),
                            },
                        ]}
                        rows={plans}
                    />
                )}

            </AdminCard>


            <Modal
                open={
                    modal === "create" ||
                    modal === "edit"
                }
                onClose={() =>
                    setModal(null)
                }
                title={
                    modal === "create"
                        ? "Add Subscription Plan"
                        : "Edit Subscription Plan"
                }
                width="max-w-3xl"
            >

                <form
                    onSubmit={save}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >

                    <Field
                        label="Plan Code"
                        required
                        value={form.planCode}
                        onChange={(v) =>
                            setForm({
                                ...form,
                                planCode: v,
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

                    <Field
                        label="Duration Days"
                        type="number"
                        value={
                            form.durationDays
                        }
                        onChange={(v) =>
                            setForm({
                                ...form,
                                durationDays: v,
                            })
                        }
                    />

                    <Field
                        label="Price"
                        type="number"
                        value={form.price}
                        onChange={(v) =>
                            setForm({
                                ...form,
                                price: v,
                            })
                        }
                    />

                    <Field
                        label="Currency"
                        value={form.currency}
                        onChange={(v) =>
                            setForm({
                                ...form,
                                currency: v,
                            })
                        }
                    />

                    <Field
                        label="Max Books Allowed"
                        type="number"
                        value={
                            form.maxBooksAllowed
                        }
                        onChange={(v) =>
                            setForm({
                                ...form,
                                maxBooksAllowed:
                                    v,
                            })
                        }
                    />

                    <Field
                        label="Max Days Per Book"
                        type="number"
                        value={
                            form.maxDaysPerBook
                        }
                        onChange={(v) =>
                            setForm({
                                ...form,
                                maxDaysPerBook: v,
                            })
                        }
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

                    <Field
                        label="Badge Text"
                        value={form.badgeText}
                        onChange={(v) =>
                            setForm({
                                ...form,
                                badgeText: v,
                            })
                        }
                    />

                    <div className="flex items-center gap-5 md:col-span-2 text-xs">

                        <label className="flex items-center gap-2">

                            <input
                                type="checkbox"
                                checked={
                                    !!form.isActive
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        isActive:
                                            e.target
                                                .checked,
                                    })
                                }
                            />

                            Active

                        </label>


                        <label className="flex items-center gap-2">

                            <input
                                type="checkbox"
                                checked={
                                    !!form.isFeatured
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        isFeatured:
                                            e.target
                                                .checked,
                                    })
                                }
                            />

                            Featured

                        </label>

                    </div>


                    <div className="md:col-span-2">

                        <TextAreaField
                            label="Admin Notes"
                            value={
                                form.adminNotes
                            }
                            onChange={(v) =>
                                setForm({
                                    ...form,
                                    adminNotes: v,
                                })
                            }
                        />

                    </div>


                    <div className="md:col-span-2 flex justify-end">

                        <Button type="submit">
                            Save Plan
                        </Button>

                    </div>

                </form>

            </Modal>

        </AdminPage>
    );
}