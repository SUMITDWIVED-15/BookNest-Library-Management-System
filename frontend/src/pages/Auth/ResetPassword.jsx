import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    BookOpen,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    Loader2,
    CheckCircle
} from "lucide-react";

import authService from "../../services/authService";
import { isValidPassword } from "../../utils/validation";

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrors({});
        setServerError("");
        setSuccess("");

        const validationErrors = {};

        if (!token) {
            validationErrors.token =
                "This password reset link is invalid or incomplete.";
        }

        if (!password) {
            validationErrors.password = "Password is required";
        } else if (!isValidPassword(password)) {
            validationErrors.password =
                "Password must contain at least 6 characters";
        }

        if (!confirmPassword) {
            validationErrors.confirmPassword =
                "Please confirm your password";
        } else if (password !== confirmPassword) {
            validationErrors.confirmPassword =
                "Passwords do not match";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);

            await authService.resetPassword({
                token,
                password
            });

            setSuccess(
                "Your password has been reset successfully."
            );

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1500);

        } catch (error) {
            console.error("Reset password failed:", error);

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to reset your password. The link may be expired or invalid.";

            setServerError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f7ff] via-white to-[#fff8ff] flex items-center justify-center px-5 py-10">

            <div className="w-full max-w-[410px]">

                {/* Logo */}
                <div className="flex justify-center">

                    <Link
                        to="/"
                        className="flex items-center gap-2"
                    >

                        <div className="w-7 h-7 rounded-md bg-[#5b35ed] flex items-center justify-center">
                            <BookOpen
                                size={15}
                                className="text-white"
                            />
                        </div>

                        <span className="text-[15px] font-bold text-gray-900">
                            BookNest
                        </span>

                    </Link>

                </div>


                {/* Heading */}
                <div className="text-center mt-4">

                    <h1 className="text-[20px] font-bold text-gray-900">
                        Reset Password
                    </h1>

                    <p className="mt-1 text-[11px] text-gray-500">
                        Create a new password for your account
                    </p>

                </div>


                <div className="mt-6 bg-white border border-gray-100 rounded-xl shadow-lg p-5">

                    {success && (
                        <div className="mb-4 px-3 py-3 rounded-md bg-green-50 border border-green-100 text-[10px] text-green-700 flex items-center gap-2">
                            <CheckCircle size={14} />
                            {success}
                        </div>
                    )}


                    {serverError && (
                        <div className="mb-4 px-3 py-2.5 rounded-md bg-red-50 border border-red-100 text-[10px] text-red-600">
                            {serverError}
                        </div>
                    )}


                    {errors.token && (
                        <div className="mb-4 px-3 py-2.5 rounded-md bg-red-50 border border-red-100 text-[10px] text-red-600">
                            {errors.token}
                        </div>
                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* Password */}
                        <div>

                            <label
                                htmlFor="reset-password"
                                className="block text-[10px] font-medium text-gray-600 mb-1.5"
                            >
                                New Password
                            </label>

                            <div className="relative">

                                <Lock
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="reset-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        setErrors((previous) => ({
                                            ...previous,
                                            password: ""
                                        }));
                                    }}
                                    placeholder="Enter your new password"
                                    className={`w-full h-10 pl-9 pr-10 rounded-md border ${
                                        errors.password
                                            ? "border-red-400"
                                            : "border-gray-200"
                                    } text-[11px] text-gray-800 outline-none focus:border-[#5b35ed] focus:ring-2 focus:ring-purple-100`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((previous) => !previous)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? (
                                        <EyeOff size={14} />
                                    ) : (
                                        <Eye size={14} />
                                    )}
                                </button>

                            </div>

                            {errors.password && (
                                <p className="mt-1 text-[9px] text-red-500">
                                    {errors.password}
                                </p>
                            )}

                        </div>


                        {/* Confirm password */}
                        <div>

                            <label
                                htmlFor="confirm-password"
                                className="block text-[10px] font-medium text-gray-600 mb-1.5"
                            >
                                Confirm Password
                            </label>

                            <div className="relative">

                                <Lock
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(event) => {
                                        setConfirmPassword(event.target.value);
                                        setErrors((previous) => ({
                                            ...previous,
                                            confirmPassword: ""
                                        }));
                                    }}
                                    placeholder="Confirm your new password"
                                    className={`w-full h-10 pl-9 pr-10 rounded-md border ${
                                        errors.confirmPassword
                                            ? "border-red-400"
                                            : "border-gray-200"
                                    } text-[11px] text-gray-800 outline-none focus:border-[#5b35ed] focus:ring-2 focus:ring-purple-100`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (previous) => !previous
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={14} />
                                    ) : (
                                        <Eye size={14} />
                                    )}
                                </button>

                            </div>

                            {errors.confirmPassword && (
                                <p className="mt-1 text-[9px] text-red-500">
                                    {errors.confirmPassword}
                                </p>
                            )}

                        </div>


                        <button
                            type="submit"
                            disabled={loading || !!success}
                            className="w-full h-10 rounded-md bg-[#5541e8] text-white text-[11px] font-semibold hover:bg-[#4632d5] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                            {loading ? (
                                <>
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                    Resetting...
                                </>
                            ) : (
                                "Reset Password"
                            )}

                        </button>

                    </form>


                    <div className="flex justify-center mt-5">

                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1.5 text-[10px] text-[#5b35ed] hover:underline"
                        >
                            <ArrowLeft size={12} />
                            Back to Sign In
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ResetPassword;