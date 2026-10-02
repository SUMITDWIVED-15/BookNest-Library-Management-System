import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing/Landing";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import PublicRoute from "./pages/Auth/PublicRoute";

import UserLayout from "./component/layout/UserLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Books from "./pages/Book/Books";
import BookDetails from "./pages/Book/BookDetails";
import Loans from "./pages/Loan/Loans";
import Reservations from "./pages/Reservation/Reservations";
import Fines from "./pages/MyFine/Fines";
import Subscriptions from "./pages/Subscription/Subscriptions";
import Wishlist from "./pages/Wishlist/Wishlist";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Setting/Settings";

import AdminLayout from "./component/layout/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import AdminBooks from "./pages/Admin/Books/Books";
import AdminLoans from "./pages/Admin/Loans/Loans";
import AdminFines from "./pages/Admin/Fines/Fines";
import AdminReservations from "./pages/Admin/Reservations/Reservations";
import AdminGenres from "./pages/Admin/Genres/Genres";
import AdminSubscriptions from "./pages/Admin/Subscriptions/Subscriptions";
import AdminUsers from "./pages/Admin/Users/Users";
import AdminPayments from "./pages/Admin/Payments/Payments";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />

                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                <Route element={<ProtectedRoute requiredRole="ROLE_USER" />}>
                    <Route element={<UserLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/books" element={<Books />} />
                        <Route path="/books/:id" element={<BookDetails />} />
                        <Route path="/loans" element={<Loans />} />
                        <Route path="/reservations" element={<Reservations />} />
                        <Route path="/fines" element={<Fines />} />
                        <Route path="/subscription" element={<Subscriptions />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route
                            index
                            element={<Navigate to="/admin/dashboard" replace />}
                        />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="books" element={<AdminBooks />} />
                        <Route path="loans" element={<AdminLoans />} />
                        <Route path="fines" element={<AdminFines />} />
                        <Route path="reservations" element={<AdminReservations />} />
                        <Route path="genres" element={<AdminGenres />} />
                        <Route path="subscriptions" element={<AdminSubscriptions />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="payments" element={<AdminPayments />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
