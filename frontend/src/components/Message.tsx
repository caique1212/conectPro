type MessageProps = {
  type?: "success" | "error" | "info";
  children: React.ReactNode;
};

export function Message({ type = "info", children }: MessageProps) {
  const styles = {
    success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
    error: "border-rose-400/30 bg-rose-500/10 text-rose-200",
    info: "border-violet-400/30 bg-violet-500/10 text-violet-100",
  };

  return <div className={`rounded-xl border px-4 py-3 text-sm ${styles[type]}`}>{children}</div>;
}
