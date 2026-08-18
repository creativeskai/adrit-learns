"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { Subject } from "@/lib/catalog";

type Props = {
  title: string;
  current: number;
  total: number;
  score: number;
  color: string;
  lightColor: string;
  subject: Subject;
  children: ReactNode;
};

export default function GameShell({ title, current, total, score, color, lightColor, subject, children }: Props) {
  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-6"
      style={{ background: `linear-gradient(135deg, #fefefe 0%, ${lightColor} 100%)` }}>
      <div className="w-full max-w-lg flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Link href={`/${subject}`} className="flex items-center gap-1" style={{ color, fontSize: "15px", fontWeight: 600 }}>
            <ArrowLeft size={16} strokeWidth={2.5} /> Back
          </Link>
          <span className="font-bold text-lg" style={{ color }}>{title}</span>
          <span className="flex items-center gap-1" style={{ color, fontSize: "15px", fontWeight: 600 }}>
            <Star size={16} fill={color} strokeWidth={0} /> {score}
          </span>
        </div>
        <div style={{ background: lightColor, height: "10px", borderRadius: "9999px" }}>
          <div style={{
            background: color, height: "10px", borderRadius: "9999px",
            width: `${(current / total) * 100}%`, transition: "width 0.5s"
          }} />
        </div>
        <p style={{ color: "#aaa", fontSize: "13px", textAlign: "center" }}>
          Question {current + 1} of {total}
        </p>
        {children}
      </div>
    </main>
  );
}
