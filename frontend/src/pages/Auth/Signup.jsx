import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BookOpen,
    User,
    Mail,
    Lock,
    Phone,
    Eye,
    EyeOff,
    Loader2
} from "lucide-react";

import authService from "../../services/authService";
import { setToken } from "../../utils/token";
import { setCurrentUser } from "../../utils/auth";
import { validateSignupForm } from "../../utils/validation";

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: ""
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        setServerError("");
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        const validationErrors = validateSignupForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {

            setLoading(true);
            setServerError("");

            const response = await authService.signup(formData);

            if (!response?.jwt) {
                throw new Error("Registration response did not contain a JWT.");
            }

            setToken(response.jwt);

            if (response.user) {
                setCurrentUser(response.user);
            }

            if (response.user?.role === "ROLE_ADMIN") {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/dashboard", { replace: true });
            }

        } catch (error) {

            console.error("Signup failed:", error);

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Registration failed. Please try again.";

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
                        Create Account
                    </h1>

                    <p className="mt-1 text-[11px] text-gray-500">
                        Join our community of book lovers
                    </p>

                </div>


                {/* Card */}
                <div className="mt-6 bg-white border border-gray-100 rounded-xl shadow-lg p-5">

                    {serverError && (
                        <div className="mb-4 px-3 py-2.5 rounded-md bg-red-50 border border-red-100 text-[10px] text-red-600">
                            {serverError}
                        </div>
                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* Full Name */}
                        <div>

                            <label
                                htmlFor="fullName"
                                className="block text-[10px] font-medium text-gray-600 mb-1.5"
                            >
                                Full Name
                            </label>

                            <div className="relative">

                                <User
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={`w-full h-10 pl-9 pr-3 rounded-md border ${
                                        errors.fullName
                                            ? "border-red-400"
                                            : "border-gray-200"
                                    } text-[11px] text-gray-800 outline-none focus:border-[#5b35ed] focus:ring-2 focus:ring-purple-100`}
                                />

                            </div>

                            {errors.fullName && (
                                <p className="mt-1 text-[9px] text-red-500">
                                    {errors.fullName}
                                </p>
                            )}

                        </div>


                        {/* Email */}
                        <div>

                            <label
                                htmlFor="email"
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
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className={`w-full h-10 pl-9 pr-3 rounded-md border ${
                                        errors.email
                                            ? "border-red-400"
                                            : "border-gray-200"
                                    } text-[11px] text-gray-800 outline-none focus:border-[#5b35ed] focus:ring-2 focus:ring-purple-100`}
                                />

                            </div>

                            {errors.email && (
                                <p className="mt-1 text-[9px] text-red-500">
                                    {errors.email}
                                </p>
                            )}

                        </div>


                        {/* Password */}
                        <div>

                            <label
                                htmlFor="password"
                                className="block text-[10px] font-medium text-gray-600 mb-1.5"
                            >
                                Password
                            </label>

                            <div className="relative">

                                <Lock
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
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


                        {/* Phone */}
                        <div>

                            <label
                                htmlFor="phone"
                                className="block text-[10px] font-medium text-gray-600 mb-1.5"
                            >
                                Phone Number
                            </label>

                            <div className="relative">

                                <Phone
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    className={`w-full h-10 pl-9 pr-3 rounded-md border ${
                                        errors.phone
                                            ? "border-red-400"
                                            : "border-gray-200"
                                    } text-[11px] text-gray-800 outline-none focus:border-[#5b35ed] focus:ring-2 focus:ring-purple-100`}
                                />

                            </div>

                            {errors.phone && (
                                <p className="mt-1 text-[9px] text-red-500">
                                    {errors.phone}
                                </p>
                            )}

                        </div>


                        {/* Submit */}
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
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}

                        </button>

                    </form>


                    <p className="text-center text-[10px] text-gray-500 mt-4">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="text-[#5b35ed] font-medium hover:underline"
                        >
                            Sign In
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Signup;