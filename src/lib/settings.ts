import { supabase } from "./supabase";

export type SiteSettings = {
  heroImage?: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data } = await supabase
    .from("site_settings")
    .select("data")
    .eq("key", "global")
    .single();
  return (data?.data as SiteSettings) || {};
}
