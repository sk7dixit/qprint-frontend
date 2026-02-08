import { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../shared/firebase";
import { Chrome, Loader2, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../shared/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";

import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import logo from "../assets/images/logo.png";

export default function SignUp() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Auto-redirect on success
    useEffect(() => {
        if (success && user) {
            const timer = setTimeout(() => {
                // Redirection logic will handle where they go (Complete Profile or Dashboard)
                navigate("/", { replace: true });
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [success, user, navigate]);

    const handleGoogleSignUp = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Signed up user:", result.user);
            setSuccess(true);
        } catch (err) {
            if (err.code === "auth/popup-closed-by-user") {
                setError("Sign up cancelled. Please try again.");
            } else {
                setError("An error occurred during sign up. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout role="entry">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Join QPrint to get started
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>
                            Create your account using Google to access all features.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
                                Account Created! Redirecting...
                            </div>
                        )}
                        <Button
                            className="w-full h-12 text-base"
                            onClick={handleGoogleSignUp}
                            disabled={loading || success}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Chrome className="mr-2 h-4 w-4" />
                            )}
                            Sign up with Google
                        </Button>

                        <div className="text-xs text-muted-foreground text-center bg-blue-50/50 p-3 rounded-md">
                            Tip: You may use your university email for better identification (recommended, not mandatory).
                        </div>
                    </CardContent>
                </Card>

                <p className="px-8 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
