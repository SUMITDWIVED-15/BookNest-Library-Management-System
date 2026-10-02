import { useEffect, useState } from "react";

import {
    Award,
    BookOpen,
    Clock3,
    CheckCircle2,
    Zap,
    Diamond,
    CalendarDays,
    CreditCard,
    XCircle
} from "lucide-react";

import subscriptionService from "../../services/subscriptionService";
import subscriptionPlanService from "../../services/subscriptionPlanService";


function Subscriptions() {

    const [plans, setPlans] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState(null);

    const [loadingPlans, setLoadingPlans] = useState(true);
    const [loadingSubscription, setLoadingSubscription] = useState(true);

    const [processingPlanId, setProcessingPlanId] = useState(null);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    /* ============================================================
       LOAD SUBSCRIPTION PLANS
    ============================================================ */

    const loadPlans = async () => {

        try {

            setLoadingPlans(true);
            setError("");

            const response =
                await subscriptionPlanService.getAllPlans();

            setPlans(
                Array.isArray(response)
                    ? response
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load subscription plans:",
                err
            );

            setPlans([]);

            setError(
                err?.response?.data?.message ||
                "Failed to load subscription plans."
            );

        } finally {

            setLoadingPlans(false);

        }
    };


    /* ============================================================
       LOAD ACTIVE SUBSCRIPTION
    ============================================================ */

    const loadCurrentSubscription = async () => {

        try {

            setLoadingSubscription(true);

            const response =
                await subscriptionService.getActiveSubscription();

            setCurrentSubscription(response);

        } catch (err) {

            /*
             * Backend throws an exception when the user has
             * no active subscription.
             *
             * That is a valid state for this page.
             */

            if (err?.response?.status === 404) {

                setCurrentSubscription(null);

            } else {

                console.error(
                    "Failed to load active subscription:",
                    err
                );

                setCurrentSubscription(null);

            }

        } finally {

            setLoadingSubscription(false);

        }
    };


    useEffect(() => {

        loadPlans();
        loadCurrentSubscription();

    }, []);


    /* ============================================================
       SUBSCRIBE / SWITCH PLAN
    ============================================================ */

    const handleSubscribe = async (plan) => {

        try {

            setProcessingPlanId(plan.id);

            setError("");
            setMessage("");


            const response =
                await subscriptionService.subscribe({
                    planId: plan.id
                });


            /*
             * Backend returns PaymentInitiateResponse.
             */

            if (response?.checkoutUrl) {

                setMessage(
                    `Payment initiated for ${plan.name} plan.`
                );

                window.open(
                    response.checkoutUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

            } else if (response?.razorpayOrderId) {

                setMessage(
                    response?.message ||
                    `Payment initiated for ${plan.name} plan.`
                );

            } else {

                setMessage(
                    response?.message ||
                    "Subscription payment has been initiated."
                );

            }

        } catch (err) {

            console.error(
                "Failed to subscribe:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to initiate subscription."
            );

        } finally {

            setProcessingPlanId(null);

        }
    };


    /* ============================================================
       CANCEL SUBSCRIPTION
    ============================================================ */

    const handleCancelSubscription = async () => {

        if (!currentSubscription?.id) {
            return;
        }


        const confirmed = window.confirm(
            "Are you sure you want to cancel your current subscription?"
        );


        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setMessage("");


            const response =
                await subscriptionService.cancelSubscription(
                    currentSubscription.id,
                    "Cancelled by user"
                );


            setCurrentSubscription(response);

            setMessage(
                "Your subscription has been cancelled."
            );

        } catch (err) {

            console.error(
                "Failed to cancel subscription:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to cancel subscription."
            );

        }

    };


    const activePlanId =
        currentSubscription?.planId;


    return (

        <div className="min-h-full bg-white">


            {/* ================= PAGE HEADER ================= */}

            <div className="border-b border-gray-200 bg-white px-6 py-5">

                <h1 className="text-[18px] font-semibold text-[#171725]">
                    Subscriptions
                </h1>

            </div>


            {/* ================= MAIN ================= */}

            <div className="px-6 py-8 md:px-8">


                {/* ================= TITLE ================= */}

                <div className="text-center">

                    <div className="inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-[#eef0ff] to-[#f4eaff] px-5 py-2">

                        <Award
                            size={24}
                            className="text-[#6957e8]"
                        />

                        <h2 className="text-3xl font-bold text-[#6957e8]">
                            Subscription Plans
                        </h2>

                    </div>


                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500">
                        Choose the perfect plan for your reading journey.
                        Upgrade, downgrade, or cancel anytime.
                    </p>

                </div>


                {/* ================= SUCCESS MESSAGE ================= */}

                {message && (

                    <div className="mx-auto mt-6 max-w-4xl rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

                        <div className="flex items-center gap-2">

                            <CheckCircle2 size={17} />

                            {message}

                        </div>

                    </div>

                )}


                {/* ================= ERROR MESSAGE ================= */}

                {error && (

                    <div className="mx-auto mt-6 max-w-4xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                        {error}

                    </div>

                )}


                {/* ================= CURRENT SUBSCRIPTION ================= */}

                {!loadingSubscription &&
                    currentSubscription &&
                    currentSubscription.isActive && (

                        <CurrentSubscription
                            subscription={currentSubscription}
                            onCancel={handleCancelSubscription}
                        />

                    )}


                {/* ================= CHOOSE YOUR PLAN ================= */}

                <div className="mt-10 text-center">

                    <h3 className="text-2xl font-bold text-[#171725]">
                        Choose Your Plan
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Select a plan that fits your reading habits
                    </p>

                </div>


                {/* ================= PLANS ================= */}

                {loadingPlans ? (

                    <div className="mx-auto mt-7 rounded-xl border border-gray-200 bg-white py-14 text-center shadow-sm">

                        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#6957e8]" />

                        <p className="text-sm text-gray-500">
                            Loading subscription plans...
                        </p>

                    </div>

                ) : plans.length === 0 ? (

                    <div className="mx-auto mt-7 rounded-xl border border-gray-200 bg-white py-14 text-center">

                        <CreditCard
                            size={38}
                            className="mx-auto text-gray-300"
                        />

                        <h3 className="mt-3 text-sm font-semibold text-gray-700">
                            No subscription plans available
                        </h3>

                    </div>

                ) : (

                    <div className="mx-auto mt-7 grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-3">

                        {plans.map((plan) => (

                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isCurrent={
                                    activePlanId === plan.id
                                }
                                processing={
                                    processingPlanId === plan.id
                                }
                                onSubscribe={() =>
                                    handleSubscribe(plan)
                                }
                            />

                        ))}

                    </div>

                )}


                {/* ================= WHY SUBSCRIBE ================= */}

                <div className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-xl bg-gradient-to-r from-[#6477e8] to-[#8246d8] px-6 py-8 md:px-8">


                    <div className="text-center">

                        <h3 className="text-2xl font-bold text-white">
                            Why Subscribe?
                        </h3>

                        <p className="mt-1 text-sm text-white/80">
                            Unlock the full potential of your reading experience
                        </p>

                    </div>


                    {/* Benefits */}

                    <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">


                        <BenefitCard
                            icon={
                                <BarChartIcon />
                            }
                            title="More Books"
                            description="Borrow multiple books simultaneously with premium plans and never run out of reading material"
                        />


                        <BenefitCard
                            icon={
                                <Zap
                                    size={29}
                                    className="text-orange-300"
                                />
                            }
                            title="Extended Duration"
                            description="Keep books longer with extended loan periods and enjoy your reading at your own pace"
                        />


                        <BenefitCard
                            icon={
                                <Diamond
                                    size={29}
                                    className="text-cyan-300"
                                />
                            }
                            title="Exclusive Access"
                            description="Get priority access to new releases and exclusive content available only to subscribers"
                        />

                    </div>

                </div>

            </div>

        </div>
    );
}


/* ============================================================
   CURRENT SUBSCRIPTION
============================================================ */

function CurrentSubscription({
    subscription,
    onCancel
}) {

    return (

        <div className="mx-auto mt-8 max-w-6xl rounded-xl border border-[#6957e8]/30 bg-[#faf9ff] p-5 shadow-sm">


            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">


                <div>

                    <div className="flex flex-wrap items-center gap-2">

                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">

                            <CheckCircle2 size={13} />

                            Active Subscription

                        </span>

                        {subscription.planName && (

                            <span className="rounded-full bg-[#eeeaff] px-3 py-1 text-[11px] font-semibold text-[#6957e8]">
                                {subscription.planName}
                            </span>

                        )}

                    </div>


                    <h3 className="mt-3 text-xl font-bold text-[#263b66]">
                        {subscription.planName || "Current Plan"}
                    </h3>


                    <p className="mt-1 text-xs text-gray-500">
                        Your current library membership
                    </p>

                </div>


                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">


                    <SubscriptionInfo
                        icon={
                            <CalendarDays
                                size={16}
                                className="text-[#6957e8]"
                            />
                        }
                        label="Start Date"
                        value={formatDate(subscription.startDate)}
                    />


                    <SubscriptionInfo
                        icon={
                            <CalendarDays
                                size={16}
                                className="text-[#6957e8]"
                            />
                        }
                        label="End Date"
                        value={formatDate(subscription.endDate)}
                    />


                    <SubscriptionInfo
                        icon={
                            <BookOpen
                                size={16}
                                className="text-[#6957e8]"
                            />
                        }
                        label="Book Limit"
                        value={
                            `${subscription.maxBooksAllowed ?? 0} Books`
                        }
                    />


                    <SubscriptionInfo
                        icon={
                            <Clock3
                                size={16}
                                className="text-[#6957e8]"
                            />
                        }
                        label="Days / Book"
                        value={
                            `${subscription.maxDaysPerBook ?? 0} Days`
                        }
                    />

                </div>


                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >

                    <XCircle size={16} />

                    Cancel Subscription

                </button>

            </div>


            {subscription.daysRemaining !== undefined && (

                <div className="mt-5 border-t border-gray-200 pt-4">

                    <div className="flex items-center justify-between text-xs">

                        <span className="text-gray-500">
                            Remaining
                        </span>

                        <span className="font-semibold text-[#6957e8]">
                            {subscription.daysRemaining} days
                        </span>

                    </div>


                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">

                        <div
                            className="h-full rounded-full bg-[#6957e8]"
                            style={{
                                width: `${calculateProgress(subscription)}%`
                            }}
                        />

                    </div>

                </div>

            )}

        </div>
    );
}


/* ============================================================
   SUBSCRIPTION INFO
============================================================ */

function SubscriptionInfo({
    icon,
    label,
    value
}) {

    return (

        <div className="rounded-lg bg-white px-3 py-3">

            <div className="flex items-center gap-1.5">

                {icon}

                <span className="text-[9px] text-gray-500">
                    {label}
                </span>

            </div>

            <p className="mt-1 text-xs font-semibold text-gray-700">
                {value}
            </p>

        </div>
    );
}


/* ============================================================
   PLAN CARD
============================================================ */

function PlanCard({
    plan,
    isCurrent,
    processing,
    onSubscribe
}) {

    const isFeatured =
        plan.isFeatured === true;


    return (

        <div
            className={`overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                isCurrent
                    ? "border-[#6957e8] shadow-[#6957e8]/20"
                    : "border-gray-200"
            }`}
        >


            {/* ================= PLAN HEADER ================= */}

            <div className="relative overflow-hidden bg-gradient-to-br from-[#6854e8] via-[#7653ec] to-[#8b55ed] px-5 py-5 text-white">


                <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10">
                </div>


                {/* Badge */}

                <div className="relative flex items-center gap-2">

                    {plan.badgeText ? (

                        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold">
                            ★ {plan.badgeText}
                        </span>

                    ) : isFeatured ? (

                        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold">
                            ★ Featured
                        </span>

                    ) : (

                        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold">
                            Membership
                        </span>

                    )}


                    {isCurrent && (

                        <span className="inline-flex items-center gap-1 rounded-full bg-green-400/90 px-2.5 py-1 text-[10px] font-semibold text-white">

                            <CheckCircle2 size={11} />

                            Active

                        </span>

                    )}

                </div>


                {/* Name */}

                <h3 className="relative mt-4 text-xl font-semibold">
                    {plan.name} Membership
                </h3>


                {/* Duration */}

                <span className="relative mt-1 inline-block rounded-full bg-white/20 px-2.5 py-1 text-[9px]">

                    {plan.durationDays ?? 0} Days

                </span>

            </div>


            {/* ================= PLAN BODY ================= */}

            <div className="p-5">


                {/* Description */}

                <p className="min-h-[48px] text-center text-xs leading-5 text-gray-500">

                    {plan.description ||
                        "Enjoy flexible access to the library with this membership plan."}

                </p>


                {/* Price */}

                <div className="mt-4 border-b border-gray-200 pb-5 text-center">

                    <span className="text-3xl font-bold text-[#6957e8]">

                        {formatPrice(
                            plan.price,
                            plan.currency
                        )}

                    </span>

                    <span className="ml-1 text-xs text-gray-500">
                        /plan
                    </span>

                </div>


                {/* Borrow Limit */}

                <div className="mt-4 flex items-center gap-3 rounded-lg bg-[#f0edff] p-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7255e8]">

                        <BookOpen
                            size={19}
                            className="text-white"
                        />

                    </div>

                    <div>

                        <p className="text-[10px] text-gray-500">
                            Borrow Limit
                        </p>

                        <p className="text-sm font-semibold text-[#4b4b70]">

                            {plan.maxBooksAllowed ?? 0} Books

                        </p>

                    </div>

                </div>


                {/* Loan Duration */}

                <div className="mt-3 flex items-center gap-3 rounded-lg bg-[#f0edff] p-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7255e8]">

                        <Clock3
                            size={19}
                            className="text-white"
                        />

                    </div>

                    <div>

                        <p className="text-[10px] text-gray-500">
                            Loan Duration
                        </p>

                        <p className="text-sm font-semibold text-[#4b4b70]">

                            {plan.maxDaysPerBook ?? 0} Days/Book

                        </p>

                    </div>

                </div>


                {/* Button */}

                <button
                    type="button"
                    disabled={isCurrent || processing}
                    onClick={onSubscribe}
                    className={`mt-5 w-full rounded-lg py-3 text-sm font-semibold transition ${
                        isCurrent
                            ? "cursor-not-allowed bg-gray-200 text-gray-500"
                            : processing
                                ? "cursor-not-allowed bg-[#9b91ed] text-white"
                                : "bg-[#6957e8] text-white hover:bg-[#5846d6]"
                    }`}
                >

                    {isCurrent ? (

                        <span className="inline-flex items-center justify-center gap-2">

                            <CheckCircle2 size={15} />

                            Current Plan

                        </span>

                    ) : processing ? (

                        "Initiating Payment..."

                    ) : (

                        "Subscribe"

                    )}

                </button>

            </div>

        </div>
    );
}


/* ============================================================
   BENEFIT CARD
============================================================ */

function BenefitCard({
    icon,
    title,
    description
}) {

    return (

        <div className="rounded-xl border border-white/15 bg-white/10 px-5 py-7 text-center backdrop-blur-sm">

            <div className="flex justify-center">
                {icon}
            </div>

            <h4 className="mt-4 text-base font-semibold text-white">
                {title}
            </h4>

            <p className="mt-2 text-xs leading-5 text-white/75">
                {description}
            </p>

        </div>
    );
}


/* ============================================================
   HELPERS
============================================================ */

function BarChartIcon() {

    return (

        <div className="flex items-center justify-center">

            <div className="relative h-7 w-7">

                <div className="absolute bottom-0 left-1 h-3 w-1.5 rounded-sm bg-white" />
                <div className="absolute bottom-0 left-3 h-5 w-1.5 rounded-sm bg-white" />
                <div className="absolute bottom-0 left-5 h-7 w-1.5 rounded-sm bg-white" />

            </div>

        </div>
    );
}


function formatPrice(price, currency) {

    const numericPrice =
        Number(price || 0);


    if (currency === "INR" || !currency) {

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0
        }).format(numericPrice);

    }


    return `${currency} ${numericPrice}`;
}


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


function calculateProgress(subscription) {

    if (
        !subscription.startDate ||
        !subscription.endDate ||
        subscription.daysRemaining === undefined
    ) {
        return 0;
    }


    const start =
        new Date(subscription.startDate);

    const end =
        new Date(subscription.endDate);

    const today =
        new Date();


    const total =
        end.getTime() - start.getTime();

    const elapsed =
        today.getTime() - start.getTime();


    if (total <= 0) {
        return 100;
    }


    const progress =
        (elapsed / total) * 100;


    return Math.min(
        100,
        Math.max(0, progress)
    );
}


export default Subscriptions;