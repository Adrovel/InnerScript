import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  await headers();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f2e9] text-[#201b16]">
      <span className="absolute right-[8%] top-[14%] rotate-6 rounded-full border border-[#ddcdb7] bg-white px-3 py-2 text-xs font-black uppercase text-[#8a5a30]">
        Brain receipt drawer
      </span>
      <span className="absolute bottom-[12%] left-[6%] -rotate-6 rounded-full border border-[#ddcdb7] bg-[#fffaf2] px-3 py-2 text-xs font-black uppercase text-[#8a5a30]">
        Search your yesterday
      </span>
      <nav className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-7">
        <strong className="text-lg">InnerScript</strong>
        <span className="text-xs font-bold uppercase tracking-normal text-[#8a5a30]">Notes with a memory</span>
      </nav>
      <section className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 px-6 py-14 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#8a5a30]">
            For thoughts hiding in twelve tabs
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-normal sm:text-7xl">
            InnerScript keeps your journal searchable and chatty.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#665848]">
            Write notes, keep them local, and ask questions across your own words when memory gets fuzzy. It is your
            private notebook with a working recall button.
          </p>
        </div>
        <div className="-rotate-1 rounded-lg border-2 border-[#201b16] bg-white p-5 shadow-[14px_14px_0_#8a5a30]">
          <div className="mb-5 flex h-28 items-end rounded-md bg-[#eadcc8] p-4">
            <span className="rounded-full bg-[#201b16] px-3 py-1 text-xs font-black uppercase text-white">
              Mood: found
            </span>
          </div>
          <div className="space-y-3">
            <span className="block h-3 w-11/12 rounded-full bg-[#c9b391]" />
            <span className="block h-3 w-8/12 rounded-full bg-[#d8c4a7]" />
            <span className="block h-3 w-10/12 rounded-full bg-[#eadcc8]" />
          </div>
        </div>
      </section>
    </main>
  );
}
