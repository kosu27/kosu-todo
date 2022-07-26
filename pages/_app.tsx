import "../src/style/index.css";

import { Auth } from "@supabase/ui";
import type { CustomAppPage } from "next/app";
import Head from "next/head";
import { memo, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { client } from "src/lib/SupabaseClient";
import { AuthLayout } from "src/layout";

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
        <title>QinTodo</title>
      </Head>
      <div className="text-slate-800 dark:text-[#C2C6D2] bg-white dark:bg-darkbg">
        <Auth.UserContextProvider supabaseClient={client}>
          <AuthLayout>
            <Toaster />
            <Component {...pageProps} />
          </AuthLayout>
        </Auth.UserContextProvider>
      </div>
    </>
  );
};

export default memo(App);
