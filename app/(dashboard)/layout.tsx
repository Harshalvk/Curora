import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="p-2 w-full h-screen">
      <div className="border w-full h-full rounded-md flex flex-col relative">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 p-4 overflow-auto">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default layout;
