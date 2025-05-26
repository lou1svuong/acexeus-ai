"use client";

import { Chat } from "@/components/ui/chat";
import { Header } from "@/components/layouts/header";
export default function Home() {
  return (
    <main className="flex h-screen max-w-5xl mx-auto justify-center items-center flex-col">
      <Header />
      <Chat />
    </main>
  );
}
