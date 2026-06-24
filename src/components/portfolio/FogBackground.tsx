export function FogBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute -top-40 -left-40 w-[60vw] h-[60vw] rounded-full blur-[160px] animate-pulse"
        style={{ background: "rgba(225, 0, 0, 0.05)", animationDuration: "8s" }}
      />
      <div
        className="absolute top-1/3 right-[-20%] w-[55vw] h-[55vw] rounded-full blur-[160px] animate-pulse"
        style={{ background: "rgba(225, 0, 0, 0.05)", animationDuration: "11s" }}
      />
      <div
        className="absolute bottom-[-20%] left-1/4 w-[70vw] h-[70vw] rounded-full blur-[130px] animate-pulse"
        style={{ background: "rgba(225, 0, 0, 0.05)", animationDuration: "13s" }}
      />
    </div>
  );
}