import type { Metadata } from "next";


export default function PublicLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <div  className="h-full bg-[#1f1f1f]">
        {children}
      
    </div>
  );
}
