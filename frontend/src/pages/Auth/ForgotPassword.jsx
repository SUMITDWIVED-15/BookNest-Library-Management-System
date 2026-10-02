import { useState } from "react";
import { Link } from "react-router-dom";
import {
    BookOpen,
    Mail,
    ArrowLeft,
    Loader2,
    CheckCircle
} from "lucide-react";

import authService from "../../services/authService";
import { isValidEmail } from "../../utils/validation";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [serverError, setServerError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setServerError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        if (!isValidEmail(email)) {
            setError("Enter a valid email");
            return;
        }

        try {
            setLoading(true);

            await authService.forgotPassword(email.trim());

            setSuccess(
                "If an account exists with this email, password reset instructions have been sent."
            );

        } catch (error) {
            console.error("Forgot password failed:", error);

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to process your request. Please try again.";

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
                        Forgot Password?
                    </h1>

                    <p className="mt-1 text-[11px] text-gray-500">
                        Enter your email and we'll send you reset instructions
                    </p>

                </div>


                {/* Card */}
                <div className="mt-6 bg-white border border-gray-100 rounded-xl shadow-lg p-5">

                    {success && (
                        <div className="mb-4 px-3 py-3 rounded-md bg-green-50 border border-green-100 text-[10px] text-green-700 flex gap-2">
                            <CheckCircle
                                size={14}
                                className="shrink-0"
                            />

                            <span>{success}</span>
                        </div>
                    )}


                    {serverError && (
                        <div className="mb-4 px-3 py-2.5 rounded-md bg-red-50 border border-red-100 text-[10px] text-red-600">
                            {serverError}
                        </div>
                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        <div>

                            <label
                                htmlFor="forgot-email"
                                className="block text-[10px] font-medium text-gray-600 mb-1.5"
                            >
                                Email Address
                            </label>

                            <div className="relative">

                                <Mail
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="forgot-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        setError("");
                                        setServerError("");
                                        setSuccess("");
                                    }}
                                    placeholder="Enter your registered email"
                                    className={`w-full h-10 pl-9 pr-3 rounded-md border ${
                                        error
                                            ? "border-red-400"
                                            : "border-gray-200"
                                    } text-[11px] text-gray-800 outline-none focus:border-[#5b35ed] focus:ring-2 focus:ring-purple-100`}
                                />

                            </div>

                            {error && (
                                <p className="mt-1 text-[9px] text-red-500">
                                    {error}
                                </p>
                            )}

                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 rounded-md bg-[#5541e8] text-white text-[11px] font-semibold hover:bg-[#4632d5] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                            {loading ? (
                                <>
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Instructions"
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

export default ForgotPassword;