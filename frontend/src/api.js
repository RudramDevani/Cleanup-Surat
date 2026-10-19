import { supabase } from "./supabase.js";

const check = (error) => {
  if (error) throw new Error(error.message || "Something went wrong. Please try again.");
};

// Volunteer, organization, report and contact forms
export async function post(kind, data) {
  const { website, ...rest } = data; // "website" is a hidden spam trap
  if (website) return;
  const { error } = await supabase.from("submissions").insert({ kind, data: rest });
  check(error);
}

// Items shown on the Adopt page (available ones first)
export async function listItems() {
  const { data, error } = await supabase
    .from("items").select("*")
    .order("adopted").order("created_at", { ascending: false });
  check(error);
  return data;
}
