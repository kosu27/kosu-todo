import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps, CustomAppPage } from "next/app";
import Head from "next/head";
import { memo, useEffect } from "react";
import { Toaster } from "react-hot-toast";

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
        <ChakraProvider>
          <Toaster />
          <Component {...pageProps} />
        </ChakraProvider>
      </div>
    </>
  );
};

export default memo(App);
