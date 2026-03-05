import { useState } from "react";
import {
  buildPromptA,
  buildPromptB,
  buildPromptC,
  COLORS,
  darkenHex,
  lightenHex,
  OBJETOS_SUGERIDOS,
  POSTURAS,
  SCENE_EXAMPLES,
} from "./hero-images/config.mjs";

export default function PromptGenerator() {
  const [template, setTemplate] = useState("A");
  const [categoria, setCategoria] = useState(Object.keys(COLORS)[0]);
  const [postura, setPostura] = useState("");
  const [objetos, setObjetos] = useState("");
  const [icono, setIcono] = useState("");
  const [customHex, setCustomHex] = useState("");
  const [copied, setCopied] = useState(false);
  const [ejemplo, setEjemplo] = useState(null);

  const colorData = COLORS[categoria];
  const hex = customHex.match(/^#[0-9a-fA-F]{6}$/) ? customHex : colorData.hex;

  const prompt =
    template === "A"
      ? buildPromptA(hex, postura || "[postura y actividad de la figura]", objetos || "[2–3 objetos planos]")
      : template === "B"
      ? buildPromptB(hex, icono || "[nombre del ícono]")
      : buildPromptC(hex, icono || "[nombre del ícono]");

  const ready =
    template === "A" ? postura.trim() && objetos.trim() : icono.trim();

  function handleEjemplo(e) {
    const item = e;
    setEjemplo(item.label);
    if (template === "A") {
      setPostura(item.postura);
      setObjetos(item.objetos);
    } else {
      setIcono(item.icono);
    }
  }

  function handleCopy() {
    try {
      const el = document.createElement("textarea");
      el.value = prompt;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      navigator.clipboard?.writeText(prompt).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  function handleTemplateChange(t) {
    setTemplate(t);
    setPostura("");
    setObjetos("");
    setIcono("");
    setEjemplo(null);
  }

  return (
    <div style={{ fontFamily: "'DM Mono', 'Courier New', monospace", background: "#0f0f0f", minHeight: "100vh", color: "#e5e5e5", padding: "2rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: #0d9488; color: #fff; }
        textarea:focus, input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: #1a1a1a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.25rem" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#0d9488", letterSpacing: "-0.02em" }}>
            monedario
          </span>
          <span style={{ fontSize: "0.7rem", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            image prompt generator
          </span>
        </div>
        <p style={{ fontSize: "0.75rem", color: "#555", margin: 0 }}>
          Genera prompts para DALL-E 3 · anti-AI aesthetic · sistema editorial v3.1
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", maxWidth: "1100px" }}>

        {/* LEFT PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Template selector */}
          <div>
            <label style={{ fontSize: "0.65rem", color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
              Template
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
              {[
                { id: "A", name: "Scene", desc: "Escena con figura" },
                { id: "B", name: "Icon", desc: "Ícono centrado" },
                { id: "C", name: "Type+Icon", desc: "Fondo para cifra" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateChange(t.id)}
                  style={{
                    background: template === t.id ? "#0d9488" : "#1a1a1a",
                    border: `1px solid ${template === t.id ? "#0d9488" : "#2a2a2a"}`,
                    borderRadius: "4px",
                    padding: "0.6rem 0.5rem",
                    cursor: "pointer",
                    color: template === t.id ? "#fff" : "#888",
                    transition: "all 0.15s",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.15rem" }}>{t.name}</div>
                  <div style={{ fontSize: "0.6rem", color: template === t.id ? "rgba(255,255,255,0.7)" : "#555" }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label style={{ fontSize: "0.65rem", color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
              Categoría → color de fondo
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              {Object.entries(COLORS).map(([cat, c]) => (
                <button
                  key={cat}
                  onClick={() => { setCategoria(cat); setCustomHex(""); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    background: categoria === cat ? "#1e1e1e" : "transparent",
                    border: `1px solid ${categoria === cat ? "#2e2e2e" : "transparent"}`,
                    borderRadius: "4px",
                    padding: "0.4rem 0.6rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.12s",
                  }}
                >
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: c.hex, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.7rem", color: categoria === cat ? "#e5e5e5" : "#666" }}>{cat}</span>
                  <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "#444", fontFamily: "monospace" }}>{c.hex}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.65rem", color: "#555" }}>Hex custom:</span>
              <input
                value={customHex}
                onChange={e => setCustomHex(e.target.value)}
                placeholder="#______"
                maxLength={7}
                style={{
                  background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "4px",
                  padding: "0.25rem 0.5rem", color: "#e5e5e5", fontSize: "0.7rem",
                  width: "90px", fontFamily: "monospace"
                }}
              />
              {customHex.match(/^#[0-9a-fA-F]{6}$/) && (
                <span style={{ width: "14px", height: "14px", borderRadius: "3px", background: customHex, display: "inline-block" }} />
              )}
            </div>
          </div>

          {/* Campos según template */}
          {template === "A" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Postura picker */}
              <div>
                <label style={{ fontSize: "0.65rem", color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
                  Postura / actividad
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.5rem" }}>
                  {POSTURAS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setPostura(p.value)}
                      style={{
                        background: postura === p.value ? "#0d9488" : "#1a1a1a",
                        border: `1px solid ${postura === p.value ? "#0d9488" : "#2a2a2a"}`,
                        borderRadius: "3px", padding: "0.28rem 0.55rem",
                        fontSize: "0.65rem", color: postura === p.value ? "#fff" : "#777",
                        cursor: "pointer", transition: "all 0.12s", whiteSpace: "nowrap"
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={postura}
                  onChange={e => setPostura(e.target.value)}
                  placeholder="o escribe una postura personalizada..."
                  rows={2}
                  style={{
                    width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a",
                    borderRadius: "4px", padding: "0.5rem 0.75rem", color: "#e5e5e5",
                    fontSize: "0.7rem", resize: "vertical", fontFamily: "inherit"
                  }}
                />
              </div>

              {/* Objetos picker */}
              <div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.65rem", color: "#666", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Objetos <span style={{ color: "#444", textTransform: "none", letterSpacing: 0 }}>(selecciona 2–3)</span>
                  </label>
                  {objetos && (
                    <button onClick={() => setObjetos("")} style={{ background: "none", border: "none", color: "#555", fontSize: "0.6rem", cursor: "pointer", padding: 0 }}>
                      limpiar
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.5rem" }}>
                  {OBJETOS_SUGERIDOS.map((o) => {
                    const selected = objetos.split(", ").includes(o.value);
                    return (
                      <button
                        key={o.label}
                        onClick={() => {
                          const parts = objetos ? objetos.split(", ").filter(Boolean) : [];
                          if (selected) {
                            setObjetos(parts.filter(p => p !== o.value).join(", "));
                          } else if (parts.length < 3) {
                            setObjetos([...parts, o.value].join(", "));
                          }
                        }}
                        style={{
                          background: selected ? "#0d948820" : "#1a1a1a",
                          border: `1px solid ${selected ? "#0d9488" : "#2a2a2a"}`,
                          borderRadius: "3px", padding: "0.28rem 0.55rem",
                          fontSize: "0.65rem", color: selected ? "#0d9488" : "#777",
                          cursor: "pointer", transition: "all 0.12s", whiteSpace: "nowrap",
                          opacity: (!selected && objetos.split(", ").filter(Boolean).length >= 3) ? 0.35 : 1
                        }}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
                <textarea
                  value={objetos}
                  onChange={e => setObjetos(e.target.value)}
                  placeholder="o escribe objetos personalizados..."
                  rows={1}
                  style={{
                    width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a",
                    borderRadius: "4px", padding: "0.5rem 0.75rem", color: "#e5e5e5",
                    fontSize: "0.7rem", resize: "none", fontFamily: "inherit"
                  }}
                />
              </div>
            </div>
          )}

          {(template === "B" || template === "C") && (
            <div>
              <label style={{ fontSize: "0.65rem", color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                Ícono / elemento
              </label>
              <textarea
                value={icono}
                onChange={e => setIcono(e.target.value)}
                placeholder="ej: shield with checkmark inside"
                rows={2}
                style={{
                  width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a",
                  borderRadius: "4px", padding: "0.6rem 0.75rem", color: "#e5e5e5",
                  fontSize: "0.75rem", resize: "vertical", fontFamily: "inherit"
                }}
              />
            </div>
          )}

          {/* Ejemplos rápidos */}
          <div>
            <label style={{ fontSize: "0.65rem", color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "0.6rem" }}>
              Ejemplos rápidos
            </label>
            {template === "A" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {Array.from(new Set(SCENE_EXAMPLES.A.map(e => e.group))).map(group => (
                  <div key={group}>
                    <div style={{ fontSize: "0.6rem", color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                      {group}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                      {SCENE_EXAMPLES.A.filter(e => e.group === group).map((e) => (
                        <button
                          key={e.label}
                          onClick={() => handleEjemplo(e)}
                          style={{
                            background: ejemplo === e.label ? "#0d948820" : "#1a1a1a",
                            border: `1px solid ${ejemplo === e.label ? "#0d9488" : "#2a2a2a"}`,
                            borderRadius: "3px", padding: "0.28rem 0.55rem",
                            fontSize: "0.65rem", color: ejemplo === e.label ? "#0d9488" : "#666",
                            cursor: "pointer", transition: "all 0.12s", whiteSpace: "nowrap"
                          }}
                        >
                          {e.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {(SCENE_EXAMPLES[template === "C" ? "B" : template] || []).map((e) => (
                  <button
                    key={e.label}
                    onClick={() => handleEjemplo(e)}
                    style={{
                      background: ejemplo === e.label ? "#0d948820" : "#1a1a1a",
                      border: `1px solid ${ejemplo === e.label ? "#0d9488" : "#2a2a2a"}`,
                      borderRadius: "3px", padding: "0.3rem 0.6rem",
                      fontSize: "0.65rem", color: ejemplo === e.label ? "#0d9488" : "#666",
                      cursor: "pointer", transition: "all 0.12s"
                    }}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL — Prompt output */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Color preview */}
          {template === "A" ? (
            <div style={{ borderRadius: "6px", overflow: "hidden", border: "1px solid #2a2a2a" }}>
              <div style={{ display: "flex", height: "36px" }}>
                {[hex, "#ffffff", lightenHex(hex, 0.45), "#f1f5f9", darkenHex(hex, 0.35)].map((c, i) => (
                  <div key={i} style={{ flex: 1, background: c, borderRight: i < 4 ? "1px solid #2a2a2a" : "none" }} />
                ))}
              </div>
              <div style={{ background: "#141414", padding: "0.3rem 0.6rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {[
                  { c: hex, label: "bg" },
                  { c: "#ffffff", label: "figure" },
                  { c: lightenHex(hex, 0.45), label: "obj 1" },
                  { c: "#f1f5f9", label: "obj 2" },
                  { c: darkenHex(hex, 0.35), label: "detail" },
                ].map(({ c, label }) => (
                  <span key={label} style={{ fontSize: "0.6rem", color: "#555", fontFamily: "monospace" }}>
                    <span style={{ color: "#888" }}>{label}</span> {c}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              height: "60px", borderRadius: "6px",
              background: hex,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid #2a2a2a"
            }}>
              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", fontFamily: "monospace" }}>
                {hex} · {Object.values(COLORS).find(c => c.hex === hex)?.label || "custom"} · Template {template}
              </span>
            </div>
          )}

          {/* Prompt box */}
          <div style={{ position: "relative", flex: 1 }}>
            <label style={{ fontSize: "0.65rem", color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
              Prompt generado
            </label>
            <textarea
              readOnly
              value={prompt}
              style={{
                width: "100%",
                height: "340px",
                background: "#1a1a1a",
                border: `1px solid ${ready ? "#0d9488" : "#2a2a2a"}`,
                borderRadius: "6px",
                padding: "1rem",
                color: ready ? "#e5e5e5" : "#555",
                fontSize: "0.72rem",
                lineHeight: "1.6",
                resize: "none",
                fontFamily: "inherit",
                transition: "border-color 0.2s"
              }}
            />
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            disabled={!ready}
            style={{
              background: copied ? "#059669" : ready ? "#0d9488" : "#1a1a1a",
              border: `1px solid ${copied ? "#059669" : ready ? "#0d9488" : "#2a2a2a"}`,
              borderRadius: "4px",
              padding: "0.75rem",
              color: ready ? "#fff" : "#444",
              fontSize: "0.75rem",
              cursor: ready ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "inherit"
            }}
          >
            {copied ? "✓ Copiado" : ready ? "Copiar prompt" : "Completa los campos"}
          </button>

          {template === "C" && (
            <p style={{ fontSize: "0.65rem", color: "#555", margin: 0, lineHeight: 1.5 }}>
              ↗ Template C genera solo el fondo. Agrega el texto/cifra en Canva o Figma con Inter Bold después.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
