export function FogBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute -top-40 -left-40 w-[60vw] h-[60vw] rounded-full blur-[160px] animate-pulse"
        style={{ background: "rgba(0, 210, 255, 0.06)", animationDuration: "8s" }}
      />
      <div
        className="absolute top-1/3 right-[-20%] w-[55vw] h-[55vw] rounded-full blur-[160px] animate-pulse"
        style={{ background: "rgba(0, 102, 177, 0.07)", animationDuration: "11s" }}
      />
      <div
        className="absolute bottom-[-20%] left-1/4 w-[70vw] h-[70vw] rounded-full blur-[130px] animate-pulse"
        style={{ background: "rgba(153, 153, 153, 0.03)", animationDuration: "13s" }}
      />
    </div>
  );
}
