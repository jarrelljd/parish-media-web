"use client";

import { useActionState } from "react";
import BrandMark from "@/components/BrandMark";
import { adminSignIn, type FormState } from "@/app/flyers/actions";

export default function AdminSignIn() {
  const [state, action, pending] = useActionState<FormState, FormData>(adminSignIn, {});
  return (
    <div className="flex min-h-screen items-center justify-center bg-vellum px-5">
      <form action={action} className="w-full max-w-sm text-center">
        <BrandMark className="mx-auto h-10 w-auto text-gilt" />
        <h1 className="mt-5 font-serif text-2xl font-semibold text-ink">Manage the Flyer Library</h1>
        <p className="mt-2 text-ink/65">For the Parish Media Company team.</p>
        <input
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Team password"
          aria-label="Team password"
          className="mt-6 w-full rounded-full bg-white px-6 py-3.5 text-[17px] text-ink ring-1 ring-ink/15 placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-lapis"
        />
        {state.error && (
          <p role="alert" className="mt-3 text-[15px] font-semibold text-rubric">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="mt-4 w-full rounded-full bg-lapis px-8 py-3.5 font-semibold text-vellum shadow-lg shadow-lapis/30 hover:bg-lapis-deep disabled:opacity-60"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
