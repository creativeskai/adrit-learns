// Shared bead-rod visual for addition (all beads active) and subtraction
// (the `strike` trailing beads shown as "taken away" instead of counted).
export default function Abacus({ number, strike = 0 }: { number: number; strike?: number }) {
  return (
    <div className="abacus">
      <div className="abacus-row">
        <div className="abacus-rod">
          {[...Array(10)].map((_, i) => {
            const isActive = i < number;
            const isRemoved = isActive && i >= number - strike;
            return (
              <div
                key={i}
                className={`abacus-bead ${isActive ? "active" : ""} ${isRemoved ? "removed" : ""}`}
                style={{ top: `${8 + i * 10}px` }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
