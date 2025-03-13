"use client";

import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useUserStateChange = () => {
  const router = useRouter();

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_OUT") {
          router.push("/");
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [router, supabase]);
};

export default useUserStateChange;
