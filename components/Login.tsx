"use client";
import React, { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Toaster } from "./ui/sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Login Function
  const LogIn = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user.uid);
        toast("Successfully Logged In", {
          description: "Welcome back, Admin",
          action: {
            label: "Done",
            onClick: () => console.log("Done"),
          },
        });
      })
      .catch((error) => {
        console.log(error);
        toast("Error Logging In", {
          description: "Internet Connectivity Problem",
          action: {
            label: "Done",
            onClick: () => console.log("Done"),
          },
        });
      });
    e.target.reset();
    setEmail("");
    setPassword("");
    setIsLoading(false);
  };
  return (
    <div className="">
      <Toaster />
      <div className="flex flex-col items-center justify-center gap-6 bg-white p-6 sm:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            rel="preload"
            href="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            {/* <Image src="/logo.png" height={50} width={50} alt="Logo" /> */}
            <ImageIcon />
            Oasis Website Admin Portal
          </Link>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription>
                  Login with your Email and Password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={LogIn}>
                  <div className="grid gap-6">
                    <div className="grid gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="m@example.com"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                          <Link
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <Input
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          required
                        />
                      </div>
                      {isLoading ? (
                        <Button id="loading" disabled className="w-full">
                          <Loader2 className="animate-spin" />
                          Logging In
                        </Button>
                      ) : (
                        <Button id="login" type="submit" className="w-full">
                          Login
                        </Button>
                      )}
                    </div>
                    <div className="text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <Link href="#" className="underline underline-offset-4">
                        Contact Admin
                      </Link>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
