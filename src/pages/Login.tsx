import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Login with Supabase
      await login(values.email, values.password);
      
      toast({
        title: "Login successful!",
        description: "Welcome back to CampusSync.",
      });
      
      // Redirect to the feed page
      navigate("/FeedPage");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Set error message
      let errorMsg = error.message || "Invalid email or password. Please try again.";
      
      // Handle specific Supabase errors
      if (error.message.includes("Invalid login credentials")) {
        errorMsg = "Invalid email or password. Please try again.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMsg = "Please confirm your email before signing in.";
      }
      
      setErrorMessage(errorMsg);
      
      toast({
        title: "Login failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show loading state while checking auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            <span className="campus-gradient-text">Campus</span>
            <span>Sync</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-sm text-destructive">
                  {errorMessage}
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              <strong>Demo Account:</strong>
              <br />
              Username: Abhi
              <br />
              Password: Abhi@12
            </p>
          </div>
        </div>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
