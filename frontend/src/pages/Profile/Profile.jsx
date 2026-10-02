import { useEffect, useState } from "react";

import {
    User,
    Mail,
    Phone,
    Shield,
    CalendarDays,
    Clock,
    Camera,
    Loader2
} from "lucide-react";

import profileService from "../../services/profileService";


function Profile() {

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /* ============================================================
       LOAD PROFILE
    ============================================================ */

    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await profileService.getProfile();

            setProfile(response);

        } catch (err) {

            console.error(
                "Failed to load profile:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load your profile."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadProfile();
    }, []);


    /* ============================================================
       LOADING
    ============================================================ */

    if (loading) {

        return (

            <div className="min-h-full bg-gradient-to-br from-[#f4f6ff] via-white to-[#f8eaff] p-7">

                <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="text-center">

                        <Loader2
                            size={35}
                            className="mx-auto animate-spin text-purple-600"
                        />

                        <p className="mt-4 text-sm text-gray-500">
                            Loading your profile...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    /* ============================================================
       ERROR
    ============================================================ */

    if (error || !profile) {

        return (

            <div className="min-h-full bg-gradient-to-br from-[#f4f6ff] via-white to-[#f8eaff] p-7">

                <div className="mb-7">

                    <h1 className="text-3xl font-bold text-gray-900">

                        My{" "}

                        <span className="text-purple-600">
                            Profile
                        </span>

                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        View your personal account information
                    </p>

                </div>


                <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">

                    <User
                        size={35}
                        className="mx-auto text-red-400"
                    />

                    <p className="mt-4 text-sm text-red-600">
                        {error || "Unable to load your profile."}
                    </p>


                    <button
                        type="button"
                        onClick={loadProfile}
                        className="mt-5 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    /* ============================================================
       PROFILE DATA
    ============================================================ */

    const fullName =
        profile.fullName || "User";


    const email =
        profile.email || "-";


    const phone =
        profile.Phone ||
        profile.phone ||
        "-";


    const role =
        profile.role || "ROLE_USER";


    const provider =
        profile.authProvider || "LOCAL";


    const initials =
        fullName
            .split(" ")
            .filter(Boolean)
            .map((name) => name[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();


    return (

        <div className="min-h-full bg-gradient-to-br from-[#f4f6ff] via-white to-[#f8eaff] p-7">


            {/* ====================================================
                HEADER
            ==================================================== */}

            <div className="mb-7">

                <h1 className="text-3xl font-bold text-gray-900">

                    My{" "}

                    <span className="text-purple-600">
                        Profile
                    </span>

                </h1>


                <p className="mt-2 text-sm text-gray-500">
                    View and manage your personal account information
                </p>

            </div>


            {/* ====================================================
                PROFILE HERO
            ==================================================== */}

            <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="h-28 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500">
                </div>


                <div className="px-7 pb-7">


                    <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">


                        {/* AVATAR */}

                        <div className="flex items-end gap-5">

                            <div className="relative">

                                {profile.profileImage ? (

                                    <img
                                        src={profile.profileImage}
                                        alt={fullName}
                                        className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                                    />

                                ) : (

                                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-purple-100 text-3xl font-bold text-purple-600 shadow-md">

                                        {initials}

                                    </div>

                                )}


                                <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-600 text-white">

                                    <Camera size={14} />

                                </div>

                            </div>


                            <div className="pb-2">

                                <h2 className="text-2xl font-bold text-gray-900">
                                    {fullName}
                                </h2>


                                <p className="mt-1 text-sm text-gray-500">
                                    {email}
                                </p>

                            </div>

                        </div>


                        {/* ROLE */}

                        <div className="pb-2">

                            <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-600">

                                <Shield size={14} />

                                {formatRole(role)}

                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* ====================================================
                PERSONAL INFORMATION
            ==================================================== */}

            <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">


                <div className="border-b border-gray-100 px-7 py-5">

                    <h2 className="text-lg font-semibold text-gray-900">
                        Personal Information
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                        Your account details
                    </p>

                </div>


                <div className="grid grid-cols-1 gap-6 px-7 py-6 md:grid-cols-2">


                    {/* FULL NAME */}

                    <ProfileInfo
                        icon={User}
                        label="Full Name"
                        value={fullName}
                    />


                    {/* EMAIL */}

                    <ProfileInfo
                        icon={Mail}
                        label="Email Address"
                        value={email}
                    />


                    {/* PHONE */}

                    <ProfileInfo
                        icon={Phone}
                        label="Phone Number"
                        value={phone}
                    />


                    {/* ACCOUNT ROLE */}

                    <ProfileInfo
                        icon={Shield}
                        label="Account Role"
                        value={formatRole(role)}
                    />

                </div>

            </div>


            {/* ====================================================
                ACCOUNT INFORMATION
            ==================================================== */}

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">


                <div className="border-b border-gray-100 px-7 py-5">

                    <h2 className="text-lg font-semibold text-gray-900">
                        Account Information
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                        Details about your BookNest account
                    </p>

                </div>


                <div className="grid grid-cols-1 gap-6 px-7 py-6 md:grid-cols-2">


                    {/* AUTH PROVIDER */}

                    <ProfileInfo
                        icon={Shield}
                        label="Authentication Provider"
                        value={formatProvider(provider)}
                    />


                    {/* ACCOUNT CREATED */}

                    <ProfileInfo
                        icon={CalendarDays}
                        label="Member Since"
                        value={formatDate(profile.createdAt)}
                    />


                    {/* LAST LOGIN */}

                    <ProfileInfo
                        icon={Clock}
                        label="Last Login"
                        value={formatDateTime(profile.lastLogin)}
                    />


                    {/* USER ID */}

                    <ProfileInfo
                        icon={User}
                        label="User ID"
                        value={profile.id ?? "-"}
                    />

                </div>

            </div>

        </div>
    );
}


/* ================================================================
   PROFILE INFO COMPONENT
================================================================ */

function ProfileInfo({
    icon: Icon,
    label,
    value
}) {

    return (

        <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-[#fafaff] p-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">

                <Icon size={18} />

            </div>


            <div className="min-w-0">

                <p className="text-xs font-medium text-gray-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                    {value}
                </p>

            </div>

        </div>
    );
}


/* ================================================================
   ROLE FORMATTER
================================================================ */

function formatRole(role) {

    if (!role) {
        return "User";
    }


    return String(role)
        .replace("ROLE_", "")
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
}


/* ================================================================
   AUTH PROVIDER FORMATTER
================================================================ */

function formatProvider(provider) {

    if (!provider) {
        return "-";
    }


    return String(provider)
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
}


/* ================================================================
   DATE FORMATTER
================================================================ */

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


/* ================================================================
   DATE + TIME FORMATTER
================================================================ */

function formatDateTime(date) {

    if (!date) {
        return "-";
    }


    const parsedDate =
        new Date(date);


    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }


    return parsedDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


export default Profile;