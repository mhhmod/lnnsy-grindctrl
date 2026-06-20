export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed p-12 text-center">
      <span className="mb-3 inline-block h-5 w-5 bg-foreground" aria-hidden />
      <div className="font-display text-[14px] font-semibold">{title}</div>
      {body && <p className="mt-2 max-w-sm font-sans text-[13px] text-muted-foreground">{body}</p>}
    </div>
  );
}
