export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#FFFFFF", fontFamily: "'Cairo', 'Noto Sans Arabic', sans-serif" }}
    >
      {/* Subtle background blobs */}
      <div
        className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(26,79,214,0.05), transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,194,168,0.06), transparent 70%)" }}
      />

      <main className="relative z-10 w-full max-w-[1200px] px-6">
        {children}
      </main>
    </div>
  );
}
