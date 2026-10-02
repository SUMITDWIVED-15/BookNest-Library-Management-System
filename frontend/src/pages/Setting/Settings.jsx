import { useEffect, useState } from "react";

import {
    Settings as SettingsIcon,
    Bell,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Save,
    ShieldCheck,
    Smartphone,
    KeyRound,
    CheckCircle,
    AlertCircle
} from "lucide-react";

import authService from "../../services/authService";
import { getCurrentUser } from "../../utils/auth";


function Settings() {

    const [settings, setSettings] = useState({
        emailNotifications: true,
        reservationNotifications: true,
        loanReminders: true,
        fineNotifications: true,
        darkMode: false
    });


    const [showPassword, setShowPassword] =
        useState(false);


    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });


    const [resetEmail, setResetEmail] =
        useState("");


    const [saving, setSaving] =
        useState(false);


    const [passwordLoading, setPasswordLoading] =
        useState(false);


    const [message, setMessage] =
        useState("");


    const [error, setError] =
        useState("");


    /* ============================================================
       LOAD LOCAL SETTINGS
    ============================================================ */

    useEffect(() => {

        const savedSettings =
            localStorage.getItem("booknest_settings");


        if (savedSettings) {

            try {

                const parsed =
                    JSON.parse(savedSettings);

                setSettings((current) => ({
                    ...current,
                    ...parsed
                }));

            } catch (err) {

                console.error(
                    "Invalid saved settings"
                );

            }

        }

    }, []);


    /* ============================================================
       APPLY DARK MODE
    ============================================================ */

    useEffect(() => {

        if (settings.darkMode) {

            document.documentElement.classList.add(
                "dark"
            );

        } else {

            document.documentElement.classList.remove(
                "dark"
            );

        }

    }, [settings.darkMode]);


    /* ============================================================
       CURRENT USER EMAIL
    ============================================================ */

    useEffect(() => {

        const user =
            getCurrentUser();


        if (user?.email) {

            setResetEmail(user.email);

        }

    }, []);


    /* ============================================================
       TOGGLE SETTING
    ============================================================ */

    const toggleSetting = (name) => {

        setSettings((current) => ({
            ...current,
            [name]: !current[name]
        }));

    };


    /* ============================================================
       PASSWORD INPUT
    ============================================================ */

    const handlePasswordChange = (e) => {

        const { name, value } =
            e.target;


        setPasswords((current) => ({
            ...current,
            [name]: value
        }));

    };


    /* ============================================================
       SAVE LOCAL SETTINGS
    ============================================================ */

    const saveSettings = () => {

        try {

            setSaving(true);
            setMessage("");
            setError("");


            localStorage.setItem(
                "booknest_settings",
                JSON.stringify(settings)
            );


            setMessage(
                "Settings saved successfully."
            );

        } catch (err) {

            setError(
                "Unable to save settings."
            );

        } finally {

            setSaving(false);

        }

    };


    /* ============================================================
       REQUEST PASSWORD RESET
    ============================================================ */

    const requestPasswordReset = async () => {

        setMessage("");
        setError("");


        if (!resetEmail.trim()) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        try {

            setPasswordLoading(true);


            const response =
                await authService.forgotPassword(
                    resetEmail.trim()
                );


            setMessage(
                response?.message ||
                "A password reset link has been sent to your email."
            );

        } catch (err) {

            console.error(
                "Password reset request failed:",
                err
            );


            setError(
                err?.response?.data?.message ||
                "Unable to send the password reset link."
            );

        } finally {

            setPasswordLoading(false);

        }

    };


    /* ============================================================
       VALIDATE PASSWORD FORM
    ============================================================ */

    const validatePasswordForm = () => {

        if (
            !passwords.currentPassword ||
            !passwords.newPassword ||
            !passwords.confirmPassword
        ) {

            setError(
                "Please fill in all password fields."
            );

            return false;

        }


        if (passwords.newPassword.length < 6) {

            setError(
                "New password must contain at least 6 characters."
            );

            return false;

        }


        if (
            passwords.newPassword !==
            passwords.confirmPassword
        ) {

            setError(
                "New password and confirmation password do not match."
            );

            return false;

        }


        return true;

    };


    /* ============================================================
       SAVE PASSWORD SECTION
    ============================================================ */

    const handlePasswordSubmit = () => {
        setMessage("");
        setError("");

        const resetSection = document.getElementById("password-reset");

        if (resetSection) {
            resetSection.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }

        setMessage(
            "Use the password reset option below to securely change your password."
        );
    };


    return (

        <div className="min-h-full bg-gradient-to-br from-[#f4f6ff] via-white to-[#f8eaff] p-7">


            {/* ====================================================
                HEADER
            ==================================================== */}

            <div className="mb-7">

                <h1 className="text-3xl font-bold text-gray-900">

                    My{" "}

                    <span className="text-purple-600">
                        Settings
                    </span>

                </h1>


                <p className="mt-2 text-sm text-gray-500">
                    Manage your account preferences and notifications
                </p>

            </div>


            {/* ====================================================
                GLOBAL MESSAGE
            ==================================================== */}

            {message && (

                <div className="mx-auto mb-5 flex max-w-5xl items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

                    <CheckCircle size={18} />

                    <span>
                        {message}
                    </span>

                </div>

            )}


            {error && (

                <div className="mx-auto mb-5 flex max-w-5xl items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                    <AlertCircle
                        size={18}
                        className="mt-0.5 shrink-0"
                    />

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* ====================================================
                SETTINGS CONTAINER
            ==================================================== */}

            <div className="mx-auto max-w-5xl space-y-6">


                {/* =================================================
                    NOTIFICATION SETTINGS
                ================================================= */}

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 px-6 py-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">

                                <Bell
                                    size={20}
                                    className="text-purple-600"
                                />

                            </div>


                            <div>

                                <h2 className="text-lg font-bold text-gray-900">
                                    Notification Settings
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Choose which notifications you want to receive
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="divide-y divide-gray-100 px-6">

                        <ToggleRow
                            icon={<Mail size={18} />}
                            title="Email Notifications"
                            description="Receive important library updates by email"
                            enabled={
                                settings.emailNotifications
                            }
                            onToggle={() =>
                                toggleSetting(
                                    "emailNotifications"
                                )
                            }
                        />


                        <ToggleRow
                            icon={<Bell size={18} />}
                            title="Reservation Notifications"
                            description="Get notified when a reserved book becomes available"
                            enabled={
                                settings.reservationNotifications
                            }
                            onToggle={() =>
                                toggleSetting(
                                    "reservationNotifications"
                                )
                            }
                        />


                        <ToggleRow
                            icon={<BookReminderIcon />}
                            title="Loan Reminders"
                            description="Receive reminders before your books are due"
                            enabled={
                                settings.loanReminders
                            }
                            onToggle={() =>
                                toggleSetting(
                                    "loanReminders"
                                )
                            }
                        />


                        <ToggleRow
                            icon={<ShieldCheck size={18} />}
                            title="Fine Notifications"
                            description="Get notified about fines and payment updates"
                            enabled={
                                settings.fineNotifications
                            }
                            onToggle={() =>
                                toggleSetting(
                                    "fineNotifications"
                                )
                            }
                        />

                    </div>

                </div>


                {/* =================================================
                    APPEARANCE
                ================================================= */}

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 px-6 py-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">

                                <SettingsIcon
                                    size={20}
                                    className="text-purple-600"
                                />

                            </div>


                            <div>

                                <h2 className="text-lg font-bold text-gray-900">
                                    Appearance
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Customize how your library dashboard looks
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="px-6">

                        <ToggleRow
                            icon={<Eye size={18} />}
                            title="Dark Mode"
                            description="Use a dark appearance for the application"
                            enabled={settings.darkMode}
                            onToggle={() =>
                                toggleSetting(
                                    "darkMode"
                                )
                            }
                        />


                        <div className="border-t border-gray-100 py-5">

                            <button
                                type="button"
                                onClick={saveSettings}
                                disabled={saving}
                                className="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {saving ? (

                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />

                                ) : (

                                    <Save size={16} />

                                )}

                                {saving
                                    ? "Saving..."
                                    : "Save Settings"}

                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    SECURITY
                ================================================= */}

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 px-6 py-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">

                                <Lock
                                    size={20}
                                    className="text-purple-600"
                                />

                            </div>


                            <div>

                                <h2 className="text-lg font-bold text-gray-900">
                                    Security
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Manage your account password
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="p-6">


                        {/* PASSWORD FORM */}

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <PasswordField
                                label="Current Password"
                                name="currentPassword"
                                value={
                                    passwords.currentPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                showPassword={
                                    showPassword
                                }
                                onToggle={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            />


                            <PasswordField
                                label="New Password"
                                name="newPassword"
                                value={
                                    passwords.newPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                showPassword={
                                    showPassword
                                }
                                onToggle={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            />


                            <PasswordField
                                label="Confirm New Password"
                                name="confirmPassword"
                                value={
                                    passwords.confirmPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                showPassword={
                                    showPassword
                                }
                                onToggle={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            />

                        </div>


                        <button
                            type="button"
                            onClick={
                                handlePasswordSubmit
                            }
                            className="mt-6 flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                        >

                            <KeyRound size={16} />

                            Change Password

                        </button>


                        {/* RESET PASSWORD */}

                        <div id="password-reset" className="mt-7 rounded-xl border border-purple-100 bg-purple-50 p-5">

                            <div className="flex items-start gap-3">

                                <KeyRound
                                    size={19}
                                    className="mt-0.5 shrink-0 text-purple-600"
                                />


                                <div className="flex-1">

                                    <h3 className="text-sm font-semibold text-purple-900">
                                        Password Reset
                                    </h3>


                                    <p className="mt-1 text-xs leading-5 text-purple-700">
                                        The current backend supports password
                                        reset through an email link.
                                    </p>


                                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">

                                        <input
                                            type="email"
                                            value={resetEmail}
                                            onChange={(e) =>
                                                setResetEmail(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter your email"
                                            className="h-10 flex-1 rounded-lg border border-purple-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                        />


                                        <button
                                            type="button"
                                            disabled={
                                                passwordLoading
                                            }
                                            onClick={
                                                requestPasswordReset
                                            }
                                            className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >

                                            {passwordLoading ? (

                                                <Loader2
                                                    size={15}
                                                    className="animate-spin"
                                                />

                                            ) : (

                                                <Mail size={15} />

                                            )}

                                            {passwordLoading
                                                ? "Sending..."
                                                : "Send Reset Link"}

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ACCOUNT SECURITY INFO
                ================================================= */}

                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">

                    <div className="flex items-start gap-3">

                        <ShieldCheck
                            size={20}
                            className="mt-0.5 shrink-0 text-purple-600"
                        />


                        <div>

                            <h3 className="text-sm font-semibold text-purple-900">
                                Account Security
                            </h3>


                            <p className="mt-1 text-xs leading-5 text-purple-700">
                                Your account is protected using secure authentication.
                                Never share your password or authentication token with anyone.
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    DEVICE INFO
                ================================================= */}

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">

                            <Smartphone
                                size={20}
                                className="text-purple-600"
                            />

                        </div>


                        <div>

                            <h2 className="text-lg font-bold text-gray-900">
                                Current Session
                            </h2>


                            <p className="mt-1 text-sm text-gray-500">
                                You are currently signed in to BookNest
                            </p>

                        </div>

                    </div>


                    <div className="mt-5 rounded-lg bg-gray-50 px-4 py-3">

                        <p className="text-xs text-gray-400">
                            Session Status
                        </p>


                        <div className="mt-1 flex items-center gap-2">

                            <span className="h-2 w-2 rounded-full bg-green-500">
                            </span>


                            <span className="text-sm font-medium text-gray-700">
                                Active
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


/* ================================================================
   TOGGLE ROW
================================================================ */

function ToggleRow({
    icon,
    title,
    description,
    enabled,
    onToggle
}) {

    return (

        <div className="flex items-center justify-between gap-5 py-5">

            <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                    {icon}
                </div>


                <div className="min-w-0">

                    <h3 className="text-sm font-semibold text-gray-800">
                        {title}
                    </h3>


                    <p className="mt-1 text-xs leading-5 text-gray-500">
                        {description}
                    </p>

                </div>

            </div>


            <button
                type="button"
                onClick={onToggle}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    enabled
                        ? "bg-purple-600"
                        : "bg-gray-300"
                }`}
                aria-label={`Toggle ${title}`}
            >

                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                        enabled
                            ? "left-6"
                            : "left-1"
                    }`}
                />

            </button>

        </div>
    );
}


/* ================================================================
   PASSWORD FIELD
================================================================ */

function PasswordField({
    label,
    name,
    value,
    onChange,
    showPassword,
    onToggle
}) {

    return (

        <div>

            <label className="mb-2 block text-xs font-medium text-gray-500">
                {label}
            </label>


            <div className="relative">

                <input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 pr-11 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />


                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >

                    {showPassword ? (

                        <EyeOff size={17} />

                    ) : (

                        <Eye size={17} />

                    )}

                </button>

            </div>

        </div>
    );
}


/* ================================================================
   BOOK REMINDER ICON
================================================================ */

function BookReminderIcon() {

    return (

        <div className="flex items-center justify-center">

            <Bell size={18} />

        </div>
    );
}


export default Settings;