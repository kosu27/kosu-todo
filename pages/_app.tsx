import { ChakraProvider } from "@chakra-ui/react";
import { Auth } from "@supabase/ui";
import type { CustomAppPage } from "next/app";
import Head from "next/head";
import { memo, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AuthLayout } from "src/layout/AuthLayout";
import { client } from "src/lib/SupabaseClient";

const App: CustomAppPage = ({ Component, pageProps }) => {
  useEffect(() => {
    if (localStorage.theme === "dark") {
      document.body.classList.add("dark");
    } else if (localStorage.theme === "light") {
      document.body.classList.remove("dark");
    } else {
      const isLight = window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches;
      if (isLight) {
        document.body.classList.remove("dark");
      } else if (!isLight) {
        document.body.classList.add("dark");
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Todo App</title>
      </Head>
      <div className="text-slate-800 bg-white">
        <Auth.UserContextProvider supabaseClient={client}>
          <AuthLayout>
            <ChakraProvider>
              <Toaster />
              <Component {...pageProps} />
            </ChakraProvider>
          </AuthLayout>
        </Auth.UserContextProvider>
      </div>
    </>
  );
};

export default memo(App);
