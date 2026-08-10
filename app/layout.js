import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// Primary Sans-Serif Font
const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-custom",
  weight: ["400", "500", "600", "700", "800"],
});

// Code / Mono Font
const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-custom",
});

export const metadata = {
  title: "AI Content Platform",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{/* <link rel="icon" href="/logo-text.png" sizes="any" /> */}</head>
      <body className={`${sansFont.variable} ${monoFont.variable} dark`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
            appearance={{
              baseTheme: shadesOfPurple,
            }}
          >
            <ConvexClientProvider>
              <Header />
              <main className="bg-slate-900 min-h-screen text-white overflow-x-hidden">
                <Toaster richColors />

                {children}
              </main>
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
