import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, CheckCircle2, CreditCard, Paintbrush, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import MonkeyPasswordIcon from '@/components/MonkeyPasswordIcon';

// Form schema for sign in
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

// Form schema for sign up
const signUpSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  isVendor: z.boolean().optional(),
  paypalEmail: z.string().email({ message: "Please enter a valid PayPal email" }).optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [signupMode, setSignupMode] = useState<'creator' | 'collector'>('collector');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get('action');
    
    if (action === 'signup') {
      setActiveTab('signup');
    } else {
      setActiveTab('signin');
    }

    // Check if user is already logged in
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    checkUser();
  }, [location, navigate]);

  // Sign in form
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Sign up form
  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      isVendor: false,
      paypalEmail: '',
      termsAccepted: false,
    },
  });

  // Handle sign in submit
  const handleSignIn = async (values: SignInFormValues) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Check for admin credentials
      if (values.email === 'rahulparathyagency@gmail.com' && values.password === 'Rahulshyami123@') {
        navigate('/admin');
        toast.success('Admin login successful!');
      } else {
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle sign up submit
  const handleSignUp = async (values: SignUpFormValues) => {
    try {
      setLoading(true);

      // Set vendor status based on signup mode
      const isVendorValue = signupMode === 'creator';
      
      // Check if vendor requires PayPal email
      if (isVendorValue && !values.paypalEmail) {
        toast.error('PayPal email is required for creators');
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            is_vendor: isVendorValue,
            paypal_email: values.paypalEmail,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Account created! Please check your email to confirm your registration.');
      
      // Navigate to sign in tab
      setActiveTab('signin');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    const email = signInForm.getValues('email');
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success('Password reset link sent to your email');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle signup mode change
  const handleSignupModeChange = (mode: 'creator' | 'collector') => {
    setSignupMode(mode);
    // Update form with vendor status
    signUpForm.setValue('isVendor', mode === 'creator');
    setIsVendor(mode === 'creator');
  };

  const toggleSignInPasswordVisibility = () => {
    setShowSignInPassword(!showSignInPassword);
  };

  const toggleSignUpPasswordVisibility = () => {
    setShowSignUpPassword(!showSignUpPassword);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 pb-12 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Button>
          
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>
                    Sign in to your account to continue
                  </CardDescription>
                </CardHeader>
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Email</FormLabel>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <FormControl>
                                <Input
                                  placeholder="name@example.com"
                                  className="pl-10"
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signInForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <div className="flex items-center justify-between">
                              <FormLabel>Password</FormLabel>
                              <button 
                                type="button"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                onClick={handlePasswordReset}
                              >
                                Forgot password?
                              </button>
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <FormControl>
                                <Input
                                  type={showSignInPassword ? "text" : "password"}
                                  className="pl-10"
                                  {...field}
                                />
                              </FormControl>
                              <MonkeyPasswordIcon isVisible={showSignInPassword} toggleVisibility={toggleSignInPasswordVisibility} />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signInForm.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <label
                              htmlFor="remember"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Remember me
                            </label>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Choose your account type to get started
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Button 
                      variant={signupMode === 'creator' ? 'default' : 'outline'} 
                      className="flex flex-col h-auto py-4 space-y-2"
                      onClick={() => handleSignupModeChange('creator')}
                    >
                      <Paintbrush size={24} />
                      <div className="text-center">
                        <div className="font-medium">Creator</div>
                        <div className="text-xs text-muted-foreground">Create and Sell AI Art</div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant={signupMode === 'collector' ? 'default' : 'outline'} 
                      className="flex flex-col h-auto py-4 space-y-2"
                      onClick={() => handleSignupModeChange('collector')}
                    >
                      <ShoppingBag size={24} />
                      <div className="text-center">
                        <div className="font-medium">Collector</div>
                        <div className="text-xs text-muted-foreground">Buy and Collect AI Art</div>
                      </div>
                    </Button>
                  </div>
                  
                  <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
                      <div className="space-y-4">
                        <FormField
                          control={signUpForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Username</FormLabel>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <FormControl>
                                  <Input
                                    placeholder="johndoe"
                                    className="pl-10"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={signUpForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Email</FormLabel>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <FormControl>
                                  <Input
                                    placeholder="name@example.com"
                                    className="pl-10"
                                    type="email"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Password</FormLabel>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <FormControl>
                                  <Input
                                    type={showSignUpPassword ? "text" : "password"}
                                    className="pl-10"
                                    {...field}
                                  />
                                </FormControl>
                                <MonkeyPasswordIcon isVisible={showSignUpPassword} toggleVisibility={toggleSignUpPasswordVisibility} />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {signupMode === 'creator' && (
                          <FormField
                            control={signUpForm.control}
                            name="paypalEmail"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel>PayPal Email</FormLabel>
                                <div className="relative">
                                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <FormControl>
                                    <Input
                                      placeholder="paypal@example.com"
                                      className="pl-10"
                                      type="email"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        
                        <FormField
                          control={signUpForm.control}
                          name="termsAccepted"
                          render={({ field }) => (
                            <FormItem className="flex items-start space-x-2">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                  id="terms"
                                />
                              </FormControl>
                              <div className="grid gap-1.5 leading-none">
                                <label
                                  htmlFor="terms"
                                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  I agree to the{" "}
                                  <a
                                    href="#"
                                    className="text-primary hover:underline"
                                  >
                                    terms of service
                                  </a>{" "}
                                  and{" "}
                                  <a
                                    href="#"
                                    className="text-primary hover:underline"
                                  >
                                    privacy policy
                                  </a>
                                </label>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <CardFooter className="px-0 mt-6">
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? 'Creating Account...' : `Sign Up as ${signupMode === 'creator' ? 'Creator' : 'Collector'}`}
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {activeTab === 'signin' ? (
              <p>
                Don't have an account?{" "}
                <button
                  className="text-primary hover:underline"
                  onClick={() => setActiveTab('signup')}
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  className="text-primary hover:underline"
                  onClick={() => setActiveTab('signin')}
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
