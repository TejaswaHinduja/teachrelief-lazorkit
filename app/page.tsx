"use client";

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Highlighter } from "@/components/ui/highlighter";
import { CometCard } from "@/components/ui/comet-card";
import { SimpleCard } from "@/components/ui/simple-card";
import Hat from './icon/hat';
import { TwitterIcon } from './icon/twitter';
import { LinkedInIcon } from './icon/linkedin';

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={300}
        repeatdelay={1}
        className={cn(
          "fixed inset-0 -z-10",
          "[mask-[radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )} />
      {/*<div className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-b  from-rose-100/40  via-rose-200/30  to-rose-400/20" />*/}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-linear-to-b  from-sky-200/40  via-blue-200/30  to-blue-300/20" />

      {/* NAVBAR */}
      <header className="w-full absolute top-0 left-0 z-40 bg-transparent">
        <div className="container mx-auto flex items-center justify-between py-6">

          {/* Logo */}
          <Link href="/" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary transition duration-300">
            <Hat></Hat>
            Teach Relief
          </Link>

          {/* Menu Buttons */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#about"
              className="text-gray-700 dark:text-gray-200 hover:text-primary transition duration-300"
            >
              About
            </Link>
            <Link
              href="#how"
              className="text-gray-700 dark:text-gray-200 hover:text-primary transition duration-300"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="text-gray-700 dark:text-gray-200 hover:text-primary transition duration-300"
            >
              Pricing
            </Link>
            <Link
              href="#connect"
              className="text-gray-700 dark:text-gray-200 hover:text-primary transition duration-300"
            >
              Connect
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Button className="cursor-pointer" variant="outline" onClick={() => router.push("/auth/login")}>
              Log In
            </Button>
            <Button className="cursor-pointer"onClick={() => router.push("/auth/signup")}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>


      <div className="flex flex-col items-center justify-center min-h-screen">
        <Highlighter action="underline" color="#87CEFA">
          <h1 className="text-3xl md:text-6xl font-bold mb-6">Automate Grading with AI Precision</h1>
        </Highlighter>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mt-6 mb-8 max-w-3xl text-center px-6">Upload your solution key, let us grade your students' work instantly.</p>
        <Button size="lg" onClick={() => router.push("/auth/signup")} className="cusror-pointer text-lg px-8 py-6">
          Get Started
        </Button>
      </div>


      <section id="about" className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <Highlighter action="highlight" color="#FF9800">
            <h2 className="text-4xl font-bold mb-6">About TeachRelief</h2>
          </Highlighter>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mt-6 mb-6">
            Grading assignments is one of the most time-consuming tasks for educators. Hours spent reviewing student work could be better used for teaching, mentoring, and curriculum development.
          </p>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
            <strong>TeachRelief</strong> uses advanced AI to automate the grading process. Simply upload your solution key, and our intelligent system will evaluate student submissions, providing accurate grades and detailed feedback in seconds.
          </p>
        </div>
      </section>


      <section id="how" className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl w-full">
          <h2 className="text-4xl font-bold text-center mb-12">How it Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col ">
              <CometCard className="w-full h-full">
                <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-white dark:bg-gray-800 h-full">
                  <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold mb-4">
                    1
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Upload Assignment</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Teachers provide the assignment and solution key to establish the grading criteria.
                  </p>
                </div>
              </CometCard>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col ">
              <CometCard className="w-full h-full">
                <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-white dark:bg-gray-800  h-full">
                  <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl font-bold mb-4">
                    2
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Student Submission</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Students upload their answers through a simple and intuitive interface.
                  </p>
                </div>
              </CometCard>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col ">
              <CometCard className="w-full h-full">
                <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-white dark:bg-gray-800 h-full">
                  <div className="w-16 h-16 rounded-full bg-purple-500 text-white flex items-center justify-center text-2xl font-bold mb-4">
                    3
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Instant Grading</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    AI judges student work and provides detailed feedback instantly.
                  </p>
                </div>
              </CometCard>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <Highlighter action="highlight" color="#FFD700">
              <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
            </Highlighter>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-6">
              Start with our free tier or unlock premium features with a subscription
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <SimpleCard>
              <div className="flex flex-col p-8 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 h-full">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Perfect for trying out the platform
                  </p>
                </div>
                
                <ul className="space-y-3 mb-8 grow">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>5 AI gradings per month</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Up to 20 students</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Email support</span>
                  </li>
                </ul>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push("/auth/signup")}
                >
                  Get Started Free
                </Button>
              </div>
            </SimpleCard>

            {/* Monthly Plan */}
            <SimpleCard>
              <div className="flex flex-col p-8 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 text-white h-full relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Monthly</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$5</span>
                    <span className="text-blue-100">/month</span>
                  </div>
                  <p className="text-sm text-blue-100">
                    For active educators
                  </p>
                </div>
                
                <ul className="space-y-3 mb-8 grow">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-300 mt-0.5">✓</span>
                    <span>Unlimited AI grading</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-300 mt-0.5">✓</span>
                    <span>Up to 100 students</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-300 mt-0.5">✓</span>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-300 mt-0.5">✓</span>
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-300 mt-0.5">✓</span>
                    <span>Gasless payments</span>
                  </li>
                </ul>

                <Button 
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 cursor-pointer"
                  onClick={() => router.push("/auth/signup?plan=monthly")}
                >
                  Subscribe Monthly
                </Button>
              </div>
            </SimpleCard>

            {/* Yearly Plan */}
            <SimpleCard>
              <div className="flex flex-col p-8 rounded-2xl bg-white dark:bg-gray-800 border-2 border-purple-500 dark:border-purple-400 h-full relative">
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  SAVE 17%
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Yearly</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$50</span>
                    <span className="text-gray-500 dark:text-gray-400">/year</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Best value for committed users
                  </p>
                </div>
                
                <ul className="space-y-3 mb-8 grow">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Unlimited AI grading</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Unlimited students</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Dedicated support</span>
                  </li>
                </ul>

                <Button 
                  className="w-full"
                  onClick={() => router.push("/auth/signup?plan=yearly")}
                >
                  Subscribe Yearly
                </Button>
              </div>
            </SimpleCard>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💳 All plans include <strong>passkey authentication</strong> and <strong>gasless transactions</strong> powered by LazorKit
            </p>
          </div>
        </div>
      </section>

      <section id="connect" className="min-h-screen flex items-center justify-center px-6">
        <div className="flex flex-col items-center justify-center gap-6">
          <Highlighter action="highlight" color="#87CEEB">
            <h2 className="text-4xl font-bold mb-8">Connect</h2>
          </Highlighter>
          <div className="flex items-center gap-6">
            <Link 
              href="https://x.com/Tej_Codes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 hover:scale-110"
              aria-label="Follow on Twitter/X"
            >
              <TwitterIcon className="w-6 h-6"/>
            </Link>
            <Link
              href="https://www.linkedin.com/in/tejaswa-hinduja-b585b6323/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 hover:scale-110"
              aria-label="Connect on LinkedIn"
            >
              <LinkedInIcon className="w-6 h-6"/>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
