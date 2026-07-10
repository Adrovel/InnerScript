"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PeopleClient() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState("");

  async function loadPeople() {
    const response = await fetch("/api/people");
    const data = await response.json();
    setPeople(data.people ?? []);
  }

  async function createPerson(event) {
    event.preventDefault();
    await fetch("/api/people", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ display_name: name }),
    });
    setName("");
    await loadPeople();
  }

  useEffect(() => {
    let ignore = false;

    async function loadInitialPeople() {
      const response = await fetch("/api/people");
      const data = await response.json();

      if (!ignore) {
        setPeople(data.people ?? []);
      }
    }

    void loadInitialPeople();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-on-background">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-primary">Back to journal</Link>
        <h1 className="mt-6 text-3xl font-semibold">People</h1>
        <form onSubmit={createPerson} className="mt-6 flex gap-3">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
          <Button type="submit">Add</Button>
        </form>
        <div className="mt-8 divide-y divide-surface-variant/20">
          {people.map((person) => (
            <div key={person.id} className="py-4">
              <h2 className="font-medium">{person.display_name}</h2>
              {person.relationship_type ? <p className="text-sm text-on-surface-variant">{person.relationship_type}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
