import type { Metadata } from "next";
import { adminConfigured, isAdmin } from "@/lib/flyers/auth";
import { listCodes, listTemplates, storageIsTemporary } from "@/lib/flyers/store";
import AdminSignIn from "@/components/flyers/admin/AdminSignIn";
import AdminPanel from "@/components/flyers/admin/AdminPanel";

export const metadata: Metadata = {
  title: "Manage flyers | Parish Flyer Library",
  robots: { index: false, follow: false },
};

export default async function Page() {
  if (!adminConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-vellum px-5 text-center">
        <p className="max-w-md text-lg text-ink/75">
          The flyer admin isn&apos;t set up yet. Add a <code>FLYER_ADMIN_PASSWORD</code> environment variable, then
          reload this page.
        </p>
      </div>
    );
  }
  if (!(await isAdmin())) return <AdminSignIn />;

  const [templates, codes] = await Promise.all([listTemplates(), listCodes()]);
  return <AdminPanel templates={templates} codes={codes} storageIsTemporary={storageIsTemporary} />;
}
