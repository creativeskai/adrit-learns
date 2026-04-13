"use client";
import { useRef, useState, useEffect } from "react";
import ResultScreen from "@/components/ResultScreen";

const COLOR = "#00897b";
const LIGHT = "#e0f2f1";

const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

const guidePoints: Record<string, {x:number,y:number}[][]> = {
  A: [[[{x:150,y:280},{x:200,y:80},{x:250,y:280}],[{x:165,y:195},{x:235,y:195}]]],
  B: [[[{x:130,y:80},{x:130,y:280}],[{x:130,y:80},{x:200,y:80},{x:220,y:100},{x:220,y:160},{x:200,y:180},{x:130,y:180}],[{x:130,y:180},{x:210,y:180},{x:230,y:200},{x:230,y:260},{x:210,y:280},{x:130,y:280}]]],
  C: [[[{x:230,y:110},{x:200,y:80},{x:150,y:80},{x:110,y:120},{x:110,y:240},{x:150,y:280},{x:200,y:280},{x:230,y:250}]]],
  D: [[[{x:130,y:80},{x:130,y:280}],[{x:130,y:80},{x:190,y:80},{x:240,y:130},{x:240,y:230},{x:190,y:280},{x:130,y:280}]]],
  E: [[[{x:230,y:80},{x:130,y:80},{x:130,y:280},{x:230,y:280}],[{x:130,y:180},{x:210,y:180}]]],
  F: [[[{x:130,y:80},{x:130,y:280}],[{x:130,y:80},{x:230,y:80}],[{x:130,y:180},{x:210,y:180}]]],
  G: [[[{x:230,y:110},{x:200,y:80},{x:150,y:80},{x:110,y:120},{x:110,y:240},{x:150,y:280},{x:200,y:280},{x:240,y:260},{x:240,y:200},{x:200,y:200}]]],
  H: [[[{x:130,y:80},{x:130,y:280}],[{x:270,y:80},{x:270,y:280}],[{x:130,y:180},{x:270,y:180}]]],
  I: [[[{x:150,y:80},{x:250,y:80}],[{x:200,y:80},{x:200,y:280}],[{x:150,y:280},{x:250,y:280}]]],
  J: [[[{x:150,y:80},{x:250,y:80}],[{x:200,y:80},{x:200,y:240},{x:170,y:275},{x:130,y:260}]]],
  K: [[[{x:130,y:80},{x:130,y:280}],[{x:230,y:80},{x:130,y:180},{x:230,y:280}]]],
  L: [[[{x:130,y:80},{x:130,y:280},{x:240,y:280}]]],
  M: [[[{x:110,y:280},{x:110,y:80},{x:180,y:180},{x:250,y:80},{x:250,y:280}]]],
  N: [[[{x:130,y:280},{x:130,y:80},{x:250,y:280},{x:250,y:80}]]],
  O: [[[{x:180,y:80},{x:130,y:100},{x:100,y:150},{x:100,y:210},{x:130,y:260},{x:180,y:280},{x:230,y:260},{x:260,y:210},{x:260,y:150},{x:230,y:100},{x:180,y:80}]]],
  P: [[[{x:130,y:80},{x:130,y:280}],[{x:130,y:80},{x:210,y:80},{x:240,y:110},{x:240,y:170},{x:210,y:190},{x:130,y:190}]]],
  Q: [[[{x:180,y:80},{x:130,y:100},{x:100,y:150},{x:100,y:210},{x:130,y:260},{x:180,y:280},{x:230,y:260},{x:260,y:210},{x:260,y:150},{x:230,y:100},{x:180,y:80}],[{x:210,y:240},{x:260,y:290}]]],
  R: [[[{x:130,y:80},{x:130,y:280}],[{x:130,y:80},{x:210,y:80},{x:240,y:110},{x:240,y:170},{x:210,y:190},{x:130,y:190}],[{x:190,y:190},{x:250,y:280}]]],
  S: [[[{x:230,y:100},{x:200,y:80},{x:150,y:80},{x:110,y:110},{x:110,y:165},{x:180,y:185},{x:250,y:205},{x:250,y:255},{x:210,y:280},{x:150,y:280},{x:110,y:260}]]],
  T: [[[{x:110,y:80},{x:260,y:80}],[{x:185,y:80},{x:185,y:280}]]],
  U: [[[{x:130,y:80},{x:130,y:230},{x:160,y:270},{x:200,y:280},{x:240,y:270},{x:270,y:230},{x:270,y:80}]]],
  V: [[[{x:120,y:80},{x:185,y:280},{x:250,y:80}]]],
  W: [[[{x:110,y:80},{x:150,y:280},{x:185,y:180},{x:220,y:280},{x:260,y:80}]]],
  X: [[[{x:120,y:80},{x:250,y:280}],[{x:250,y:80},{x:120,y:280}]]],
  Y: [[[{x:120,y:80},{x:185,y:180},{x:250,y:80}],[{x:185,y:180},{x:185,y:280}]]],
  Z: [[[{x:120,y:80},{x:250,y:80},{x:120,y:280},{x:250,y:280}]]],
};

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function TracingGame() {
  const [set] = useState(() => shuffle(letters).slice(0, 8));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [strokes, setStrokes] = useState<{x:number,y:number}[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<{x:number,y:number}[]>([]);
  const [completed, setCompleted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const letter = set[current];

  useEffect(() => { drawGuide(); }, [current, strokes]);

  function getPos(e: React.TouchEvent | React.MouseEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top) * scaleY
    };
  }

  function drawGuide() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const paths = guidePoints[letter] || [];
    paths[0]?.forEach(stroke => {
      ctx.beginPath();
      ctx.setLineDash([12, 8]);
      ctx.strokeStyle = "#b2dfdb";
      ctx.lineWidth = 18;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      stroke.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.setLineDash([]);
    });

    strokes.forEach(stroke => {
      ctx.beginPath();
      ctx.strokeStyle = COLOR;
      ctx.lineWidth = 16;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      stroke.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });

    if (currentStroke.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = COLOR;
      ctx.lineWidth = 16;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      currentStroke.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }
  }

  function startDraw(e: React.TouchEvent | React.MouseEvent) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || completed) return;
    setDrawing(true);
    const pos = getPos(e, canvas);
    setCurrentStroke([pos]);
  }

  function moveDraw(e: React.TouchEvent | React.MouseEvent) {
    e.preventDefault();
    if (!drawing || completed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getPos(e, canvas);
    setCurrentStroke(s => [...s, pos]);
    drawGuide();
  }

  function endDraw(e: React.TouchEvent | React.MouseEvent) {
    e.preventDefault();
    if (!drawing) return;
    setDrawing(false);
    setStrokes(s => [...s, currentStroke]);
    setCurrentStroke([]);
  }

  function checkLetter() {
    if (strokes.length === 0) return;
    setCompleted(true);
    setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= set.length) { setDone(true); }
      else {
        setCurrent(c => c + 1);
        setStrokes([]);
        setCurrentStroke([]);
        setCompleted(false);
      }
    }, 1000);
  }

  function clearCanvas() { setStrokes([]); setCurrentStroke([]); setCompleted(false); }

  function restart() { setCurrent(0); setScore(0); setDone(false); setStrokes([]); setCurrentStroke([]); setCompleted(false); }

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} onReplay={restart} />;

  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-6"
      style={{ background: `linear-gradient(135deg, #fefefe 0%, ${LIGHT} 100%)` }}>
      <div className="w-full max-w-lg flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <a href="/" style={{ color: COLOR, fontSize: "15px", fontWeight: 600 }}>← Home</a>
          <span className="font-bold text-lg" style={{ color: COLOR }}>Letter Tracing</span>
          <span style={{ color: COLOR, fontSize: "15px", fontWeight: 600 }}>⭐ {score}</span>
        </div>
        <div style={{ background: LIGHT, height: "10px", borderRadius: "9999px" }}>
          <div style={{ background: COLOR, height: "10px", borderRadius: "9999px", width: `${(current / set.length) * 100}%`, transition: "width 0.5s" }} />
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center rounded-2xl text-5xl font-black"
            style={{ background: LIGHT, color: COLOR }}>{letter}</div>
          <p style={{ color: "#aaa", fontSize: "15px" }}>Trace the letter {letter}</p>
        </div>

        <div className="relative rounded-3xl overflow-hidden"
          style={{ background: "white", border: `2px solid ${LIGHT}` }}>
          <canvas
            ref={canvasRef}
            width={400} height={360}
            style={{ width: "100%", height: "auto", touchAction: "none", display: "block",
              background: completed ? "#e8f5e9" : "white" }}
            onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw}
            onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}
          />
          {completed && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(232,245,233,0.7)" }}>
              <span style={{ fontSize: "80px" }}>✅</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={clearCanvas}
            className="flex-1 py-4 rounded-2xl text-lg font-bold active:scale-95 transition-transform"
            style={{ background: "white", color: COLOR, border: `2px solid ${COLOR}` }}>
            Clear ✗
          </button>
          <button onClick={checkLetter}
            className="flex-1 py-4 rounded-2xl text-white text-lg font-bold active:scale-95 transition-transform"
            style={{ background: completed ? "#aaa" : COLOR }}>
            Done ✓
          </button>
        </div>
      </div>
    </main>
  );
}
