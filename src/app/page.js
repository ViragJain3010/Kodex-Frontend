// src/app/page.js
"use client";
import { Suspense } from "react";
import Footer from "@/components/Footer/Footer";
import ResizableLayout from "@/components/ResizableLayout/ResizableLayout";
import LoadingSpinner from "./Loading";
import { EditorProvider } from "@/context/EditorContext";

export default function Home() {
  return (
    <EditorProvider>
      <Suspense fallback={<LoadingSpinner />}>
        
        <main className="flex flex-col min-h-full bg-gray-200 dark:bg-gray-800">
          <ResizableLayout />
          <Footer />
        </main>
      </Suspense>
    </EditorProvider>
  );
}
