import { Auth } from "@supabase/ui";
import type { CustomLayout } from "next";
import { useEffect, useState } from "react";
import { client } from "src/lib/SupabaseClient";

import { LayoutErrorBoundary } from "./LayoutErrorBoundary";

type Props = {
  children: React.ReactElement;
};

/**
 * @package
 */
export const AuthLayout: CustomLayout = (props: Props) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const { children } = props;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <LayoutErrorBoundary>
          {isMounted ? (
            <div>{children}</div>
          ) : (
            <div>
              <Auth
                supabaseClient={client}
                providers={["google"]}
                socialColors
              />
            </div>
          )}
        </LayoutErrorBoundary>
      </main>
    </div>
  );
};
