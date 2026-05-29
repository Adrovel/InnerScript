import { headers } from "next/headers";
import landing from "../landing.json";

export const dynamic = "force-dynamic";

export default async function Home() {
  await headers();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f2e9] text-[#201b16]">
      <nav className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-7">
        <strong className="text-lg">{landing.name}</strong>
        <span className="text-xs font-bold uppercase tracking-normal text-[#8a5a30]">{landing.navNote}</span>
      </nav>
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-14">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#8a5a30]">
            {landing.problemLabel}
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-normal sm:text-7xl">
            {landing.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#665848]">
            {landing.problem}
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#665848]">
            {landing.solution}
          </p>
          <p className="mt-8 text-base font-black text-[#8a5a30]">{landing.status}</p>
          <a
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-md border border-[#201b16] bg-[#201b16] px-5 text-sm font-black text-white no-underline"
            href={landing.contact.href}
          >
            {landing.contact.label}
          </a>
        </div>
      </section>
    </main>
  );
}
