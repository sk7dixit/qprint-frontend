import { useState, useEffect } from "react";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../shared/firebase";
import { Chrome, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../shared/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function Login() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);


    // State for active tab to control animation
    const [activeTab, setActiveTab] = useState("student");

    // Shopkeeper states
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");


    const handleStudentLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setSuccess(true);
            setSuccess(true);
            // AuthGuard handles redirection
        } catch (err) {
            if (err.code === "auth/popup-closed-by-user") {
                setError("Google login cancelled. Please try again.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleShopkeeperLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!identifier.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        try {
            let email = identifier;
            if (!identifier.includes("@")) {
                const phone = identifier.replace(/[\s-]/g, "");
                if (!/^\d+$/.test(phone)) {
                    setError("Please enter a valid email or phone number.");
                    setLoading(false);
                    return;
                }
                email = `${phone}@qprint.internal`;
            }

            // 1. Firebase Login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Force token refresh to get latest claims
            const tokenResult = await user.getIdTokenResult(true);
            const role = tokenResult.claims.role?.toLowerCase();

            // 3. Role check
            if (role !== "seller") {
                await auth.signOut();
                setError("Access denied: This account is not authorized as a Shopkeeper.");
                setLoading(false);
                return;
            }

            // 4. Force password reset check
            if (tokenResult.claims.forcePasswordReset === true) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/seller/reset-password", { replace: true });
                }, 1000);
                return;
            }

            // 5. Normal dashboard redirect
            setSuccess(true);
        } catch (err) {
            setPassword("");
            setError("Invalid credentials. Please verify your email and password.");
            console.error("Auth Error:", err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <AuthLayout role={activeTab}>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Login to your account to continue
                    </p>
                </div>

                <Tabs defaultValue="student" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="student">Student</TabsTrigger>
                        <TabsTrigger value="shopkeeper">Shopkeeper</TabsTrigger>
                    </TabsList>

                    <TabsContent value="student">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Login</CardTitle>
                                <CardDescription>
                                    Students can login instantly using their Google account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {error && (
                                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
                                        Login Successful! Redirecting...
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    className="w-full h-12 text-base"
                                    onClick={handleStudentLogin}
                                    disabled={loading || success}
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Chrome className="mr-2 h-4 w-4" />
                                    )}
                                    Continue with Google
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="shopkeeper">
                        <Card>
                            <CardHeader>
                                <CardTitle>Shopkeeper Login</CardTitle>
                                <CardDescription>
                                    Enter your credentials to access your dashboard.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleShopkeeperLogin}>
                                    <div className="grid gap-4">
                                        {error && (
                                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                                {error}
                                            </div>
                                        )}
                                        {success && (
                                            <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
                                                Login Successful! Redirecting...
                                            </div>
                                        )}
                                        <div className="grid gap-2">
                                            <Label htmlFor="identifier">Email or Phone</Label>
                                            <Input
                                                id="identifier"
                                                placeholder="name@example.com"
                                                type="text"
                                                autoCapitalize="none"
                                                autoCorrect="off"
                                                disabled={loading || success}
                                                value={identifier}
                                                onChange={(e) => setIdentifier(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                disabled={loading || success}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <Button disabled={loading || success}>
                                            {loading && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Sign In
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <p className="px-8 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
