import { useState, useRef } from "react";

const WHATSAPP_THE_SET = "5544991009998";

const C = {
  black:    "#0A0A0A",
  dark:     "#1C1C1C",
  mid:      "#3A3A3A",
  gray:     "#888888",
  light:    "#D4D4D4",
  offwhite: "#F0F0F0",
  white:    "#FFFFFF",
};

const QUESTIONS = [
  {
    question: "Como você se sente em relação à sua imagem hoje?",
    options: [
      "Insegura — sinto que algo não está alinhado",
      "Perdida — não sei bem o que combina comigo",
      "Estagnada — faz tempo que não mudo nada",
      "Consciente — sei o que quero, mas preciso de direção",
    ],
  },
  {
    question: "O que você acredita que sua imagem está comunicando agora?",
    options: [
      "Menos do que eu realmente sou",
      "Algo genérico, sem identidade clara",
      "Não faço ideia — nunca parei pra pensar nisso",
      "Algo próximo, mas ainda superficial",
    ],
  },
  {
    question: "Em qual situação sua imagem mais te atrapalha ou te deixa insegura?",
    options: [
      "Reuniões e ambientes profissionais",
      "Redes sociais e fotos",
      "Eventos sociais e encontros",
      "No dia a dia — em todas as situações",
    ],
  },
  {
    question: "Você está passando por alguma transição agora?",
    options: [
      "Sim, profissional — mudança de cargo, empresa ou negócio",
      "Sim, pessoal — fase nova, recomeço",
      "Sim, os dois ao mesmo tempo",
      "Não — mas sinto que preciso evoluir a imagem mesmo assim",
    ],
  },
  {
    question: "O que te fez levantar a mão no story?",
    options: [
      "Curiosidade — quero entender o que minha imagem comunica",
      "Identificação — me reconheci no que foi dito",
      "Necessidade — preciso mudar, mas não sei por onde começar",
      "Momento — sinto que é agora",
    ],
  },
];

const FACE_DATA = {
  oval: {
    label: "Oval",
    tagline: "O formato mais versátil do visagismo.",
    desc: "Proporções naturalmente harmônicas — levemente mais longo que largo, com contornos suaves. É o formato de referência no visagismo por sua versatilidade.",
    hair: ["Praticamente todos os cortes favorecem — liberdade criativa real", "Bob médio e long bob valorizam as proporções naturais", "Camadas suaves criam movimento sem desequilibrar", "Franja lateral ou cortininha funciona muito bem"],
    evitar: "Cuidado com volumes excessivos nas laterais — podem alargar a percepção do rosto.",
  },
  redondo: {
    label: "Redondo",
    tagline: "Suavidade que pede direção para projetar autoridade.",
    desc: "Largura e comprimento similares, com contornos suaves e maçãs cheias. A estratégia é criar verticalidade e reduzir a percepção de amplitude horizontal.",
    hair: ["Volume no topo, muito menos nas laterais", "Cortes em camadas longas que criam verticalidade", "Franja lateral — nunca reta", "Cabelos longos com movimento vertical favorecem"],
    evitar: "Evite cortes muito curtos e franjas retas — encurtam visualmente o rosto.",
  },
  quadrado: {
    label: "Quadrado",
    tagline: "Força e estrutura que comunicam presença.",
    desc: "Linha da mandíbula angular e bem definida, com testa e maçãs de largura similar. A força desse formato pede suavização estratégica para equilibrar.",
    hair: ["Camadas que suavizam a mandíbula", "Ondas e cachos criam contraste com a angularidade", "Franja lateral com queda assimétrica", "Comprimento médio a longo equilibra a estrutura"],
    evitar: "Evite cortes retos na altura da mandíbula — acentuam os ângulos.",
  },
  coração: {
    label: "Coração",
    tagline: "Delicadeza na base que pede equilíbrio no conjunto.",
    desc: "Testa mais larga que vai afunilando até um queixo fino e pontiagudo. A estratégia é equilibrar a parte superior com a inferior.",
    hair: ["Volume na altura da mandíbula para equilibrar", "Bob com volume nas pontas", "Franja lateral que quebra a amplitude da testa", "Ondas a partir das maçãs criam harmonia"],
    evitar: "Evite muito volume no topo — acentua a testa larga.",
  },
  diamante: {
    label: "Diamante",
    tagline: "Formato raro e marcante que exige precisão.",
    desc: "Maçãs proeminentes com testa e mandíbula mais estreitas. Um dos formatos mais raros — pede equilíbrio estratégico nas extremidades.",
    hair: ["Volume na testa e queixo para equilibrar as maçãs", "Franja reta ou levemente lateral", "Camadas com volume no topo e nas pontas", "Cortes que adicionam largura na linha do queixo"],
    evitar: "Evite volume excessivo nas maçãs — amplifica o que já é proeminente.",
  },
  oblongo: {
    label: "Alongado",
    tagline: "Estrutura vertical que pede amplitude estratégica.",
    desc: "Rosto visivelmente mais longo que largo, com testa, maçãs e mandíbula de largura similar. A estratégia é criar percepção de amplitude.",
    hair: ["Volume nas laterais para criar largura", "Franja reta — encurta visualmente o rosto", "Bob e cortes médios são os mais favoráveis", "Ondas horizontais criam amplitude"],
    evitar: "Evite cortes muito longos e lisos — acentuam o comprimento.",
  },
};

const analyzeWithAI = async (imageBase64, answers) => {
  const answersText = QUESTIONS.map((q, i) => `${i + 1}. ${q.question}\nResposta: ${answers[i] || "Não respondida"}`).join("\n\n");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
          {
            type: "text",
            text: `Você é especialista em visagismo. Analise o formato do rosto nesta selfie.
Formatos possíveis: oval, redondo, quadrado, coração, diamante, oblongo.
Analise: proporção largura x comprimento, formato da testa, proeminência das maçãs, linha da mandíbula e queixo.

Contexto pessoal:
${answersText}

Responda SOMENTE em JSON puro, sem markdown:
{
  "formato": "oval",
  "mensagem_personalizada": "3 frases conectando o formato do rosto com o momento de vida dela. Tom sofisticado, empático, direto. Como quem entende profundamente de imagem e percepção."
}`,
          },
        ],
      }],
    }),
  });
  const data = await res.json();
  const text = data.content.map(i => i.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
};

// ── Decorativo "7" da identidade The Set ─────────────────────────────────
const SevenDecor = ({ color = "#ffffff", opacity = 0.04, size = 260 }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 200 280" fill="none" style={{ position: "absolute", right: -20, top: 0, pointerEvents: "none", opacity }}>
    <line x1="30" y1="8" x2="185" y2="8" stroke={color} strokeWidth="3"/>
    <line x1="185" y1="8" x2="20" y2="272" stroke={color} strokeWidth="3"/>
  </svg>
);

// ── Ícone seta The Set ────────────────────────────────────────────────────
const ArrowBox = () => (
  <div style={{ width: 32, height: 32, background: C.dark, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
      <path d="M2 2h8v8M2 10L10 2" stroke={C.light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

// ── Círculo decorativo do branding ───────────────────────────────────────
const CircleDecor = () => (
  <div style={{ position: "absolute", right: -120, bottom: -120, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(60,60,60,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
);

export default function TheSetVisagismo() {
  const [step, setStep]           = useState("welcome");
  const [nome, setNome]           = useState("");
  const [whatsapp, setWhatsapp]   = useState("");
  const [foto, setFoto]           = useState(null);
  const [fotoBase64, setFotoBase64] = useState(null);
  const [answers, setAnswers]     = useState({});
  const [currentQ, setCurrentQ]   = useState(0);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro]           = useState("");
  const fileRef = useRef();

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErro("");
    setFoto(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = ev => setFotoBase64(ev.target.result.split(",")[1]);
    reader.readAsDataURL(file);
  };

  const handleAnswer = (answer) => {
    const na = { ...answers, [currentQ]: answer };
    setAnswers(na);
    if (currentQ < QUESTIONS.length - 1) setCurrentQ(currentQ + 1);
    else setStep("revisao");
  };

  const runAnalysis = async (fa) => {
    setStep("analisando");
    try {
      const r = await analyzeWithAI(fotoBase64, Object.values(fa));
      setResultado(r);
      setStep("resultado");
    } catch {
      setErro("Não conseguimos analisar. Use uma selfie frontal com boa iluminação.");
      setStep("foto");
    }
  };

  const faceData   = resultado ? (FACE_DATA[resultado.formato] || FACE_DATA["oval"]) : null;
  const firstName  = nome.split(" ")[0];
  const waMensagem = resultado
    ? encodeURIComponent(`Olá! Fiz o teste de visagismo da The Set.\n\n*Nome:* ${nome}\n*WhatsApp:* ${whatsapp}\n*Formato de rosto:* ${faceData?.label}\n\nMinhas respostas:\n${Object.values(answers).map((a,i) => `${i+1}. ${a}`).join("\n")}\n\nQuero agendar uma reunião estratégica.`)
    : "";
  const waUrl = `https://wa.me/${WHATSAPP_THE_SET}?text=${waMensagem}`;

  // ── Estilos reutilizáveis ──────────────────────────────────────────────
  const inputStyle = {
    width: "100%", background: "transparent", border: "none",
    borderBottom: `1px solid ${C.mid}`, color: C.white,
    fontSize: 18, fontFamily: "inherit", fontWeight: 300,
    padding: "10px 0", outline: "none",
  };

  const btnPrimary = {
    width: "100%", background: C.white, color: C.black,
    border: "none", padding: "16px", fontSize: 11,
    letterSpacing: "0.3em", textTransform: "uppercase",
    fontFamily: "inherit", fontWeight: 600, cursor: "pointer",
    marginTop: 16, transition: "opacity .2s",
  };

  const btnOutline = {
    width: "100%", background: "transparent", color: C.light,
    border: `1px solid ${C.mid}`, padding: "14px",
    fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase",
    fontFamily: "inherit", fontWeight: 400, cursor: "pointer",
    marginTop: 10,
  };

  const tag = {
    fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase",
    color: C.gray, marginBottom: 16, display: "block",
  };

  const divider = <div style={{ width: "100%", height: 1, background: C.mid, margin: "28px 0" }} />;

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'DM Sans', 'Outfit', 'Helvetica Neue', sans-serif", fontWeight: 300 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@200;300;400;500&display=swap');
        @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes breathe  { 0%,100% { opacity:.35; } 50% { opacity:.7; } }
        * { box-sizing:border-box; margin:0; padding:0; }
        input::placeholder { color: #555; }
        .opt:hover { background: #1C1C1C !important; border-color: #555 !important; }
        .btn-primary:hover { opacity: .85; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ background: C.black, borderBottom: `1px solid ${C.dark}`, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 400, letterSpacing: "0.08em" }}>the set.</div>
          <div style={{ fontSize: 9, letterSpacing: "0.35em", color: C.gray, textTransform: "uppercase", marginTop: 2 }}>
            MARCA ✦ IMAGEM ✦ PRESENÇA ✦ COMUNICAÇÃO
          </div>
        </div>
        <div style={{ fontSize: 10, letterSpacing: "0.25em", color: C.gray, textTransform: "uppercase" }}>
          Teste de Visagismo
        </div>
      </header>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ══ WELCOME ══════════════════════════════════════════════════════ */}
        {step === "welcome" && (
          <div style={{ animation: "fadeUp .5s ease" }}>

            {/* Hero */}
            <div style={{ position: "relative", overflow: "hidden", padding: "64px 0 48px" }}>
              <SevenDecor color="#ffffff" opacity={0.05} size={280} />
              <span style={tag}>Visagismo ✦ Imagem Pessoal</span>
              <h1 style={{ fontSize: "clamp(32px,8vw,52px)", fontWeight: 200, lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: 20 }}>
                O que a sua<br />imagem está<br />comunicando?
              </h1>
              <p style={{ fontSize: 15, color: C.gray, lineHeight: 1.75, maxWidth: 400 }}>
                Envie uma selfie, responda 5 perguntas e receba uma análise personalizada do seu formato de rosto — com diretrizes reais de visagismo.
              </p>
            </div>

            {divider}

            <button className="btn-primary" style={{ ...btnPrimary, marginTop: 0 }} onClick={() => setStep("dados")}>
              Iniciar análise
            </button>

            <p style={{ fontSize: 11, color: C.mid, textAlign: "center", marginTop: 16, letterSpacing: "0.08em" }}>
              Menos de 3 minutos
            </p>
          </div>
        )}

        {/* ══ DADOS ════════════════════════════════════════════════════════ */}
        {step === "dados" && (
          <div style={{ animation: "fadeUp .4s ease", paddingTop: 48 }}>
            <span style={tag}>01 — Identificação</span>
            <h2 style={{ fontSize: "clamp(26px,6vw,38px)", fontWeight: 200, marginBottom: 40 }}>
              Quem é você?
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div>
                <span style={{ ...tag, marginBottom: 8 }}>Nome</span>
                <input style={inputStyle} placeholder="Como prefere ser chamada" value={nome} onChange={e => setNome(e.target.value)} />
              </div>
              <div>
                <span style={{ ...tag, marginBottom: 8 }}>WhatsApp</span>
                <input style={inputStyle} placeholder="(11) 99999-9999" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
              </div>
            </div>

            <p style={{ fontSize: 11, color: C.mid, marginTop: 20, lineHeight: 1.6, letterSpacing: "0.05em" }}>
              Seus dados são usados apenas para envio do resultado e contato da The Set.
            </p>

            {divider}

            <button
              className="btn-primary"
              style={{ ...btnPrimary, opacity: nome && whatsapp ? 1 : 0.35, cursor: nome && whatsapp ? "pointer" : "not-allowed" }}
              onClick={() => nome && whatsapp && setStep("foto")}
            >
              Continuar
            </button>
          </div>
        )}

        {/* ══ FOTO ═════════════════════════════════════════════════════════ */}
        {step === "foto" && (
          <div style={{ animation: "fadeUp .4s ease", paddingTop: 48 }}>
            <span style={tag}>02 — Selfie</span>
            <h2 style={{ fontSize: "clamp(26px,6vw,38px)", fontWeight: 200, marginBottom: 12 }}>
              Envie sua selfie
            </h2>
            <p style={{ fontSize: 14, color: C.gray, lineHeight: 1.75, marginBottom: 32 }}>
              Foto de frente, boa iluminação, sem óculos.<br />A IA vai identificar o formato do seu rosto.
            </p>

            {erro && (
              <div style={{ border: `1px solid ${C.mid}`, padding: "14px 18px", marginBottom: 20, fontSize: 13, color: C.light, lineHeight: 1.6 }}>
                {erro}
              </div>
            )}

            <div
              onClick={() => fileRef.current.click()}
              style={{
                border: `1px solid ${foto ? C.gray : C.dark}`,
                cursor: "pointer", overflow: "hidden",
                minHeight: foto ? 0 : 220,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "border .3s", marginBottom: 16, position: "relative",
              }}
            >
              {foto
                ? <img src={foto} alt="Selfie" style={{ width: "100%", maxHeight: 360, objectFit: "cover", display: "block" }} />
                : (
                  <div style={{ textAlign: "center", padding: 48 }}>
                    <div style={{ fontSize: 32, color: C.mid, marginBottom: 16 }}>↑</div>
                    <div style={{ fontSize: 12, color: C.gray, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                      Toque para enviar
                    </div>
                  </div>
                )
              }
            </div>

            <input ref={fileRef} type="file" accept="image/*" capture="user" onChange={handleFoto} style={{ display: "none" }} />

            {foto && (
              <>
                <button className="btn-primary" style={btnPrimary} onClick={() => setStep("perguntas")}>
                  Usar esta foto →
                </button>
                <button style={btnOutline} onClick={() => { setFoto(null); setFotoBase64(null); fileRef.current.click(); }}>
                  Trocar foto
                </button>
              </>
            )}
          </div>
        )}

        {/* ══ PERGUNTAS ════════════════════════════════════════════════════ */}
        {step === "perguntas" && (
          <div style={{ animation: "fadeUp .35s ease", paddingTop: 48 }}>
            <span style={tag}>03 — Perguntas</span>

            {/* barra de progresso */}
            <div style={{ display: "flex", gap: 4, marginBottom: 40 }}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 2, background: i < currentQ ? C.white : i === currentQ ? C.gray : C.dark, transition: "all .3s" }} />
              ))}
            </div>

            <div style={{ fontSize: 11, color: C.mid, letterSpacing: "0.2em", marginBottom: 12 }}>
              {currentQ + 1} / {QUESTIONS.length}
            </div>

            <h2 style={{ fontSize: "clamp(18px,5vw,26px)", fontWeight: 300, lineHeight: 1.4, marginBottom: 36 }}>
              {QUESTIONS[currentQ].question}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {QUESTIONS[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  className="opt"
                  onClick={() => handleAnswer(opt)}
                  style={{
                    background: "transparent", border: `1px solid ${C.dark}`,
                    color: C.white, padding: "16px 20px",
                    fontSize: 14, fontFamily: "inherit", fontWeight: 300,
                    cursor: "pointer", textAlign: "left",
                    display: "flex", gap: 16, alignItems: "flex-start",
                    lineHeight: 1.5, transition: "all .2s",
                  }}
                >
                  <span style={{ color: C.gray, fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", marginTop: 2, flexShrink: 0 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ REVISÃO ══════════════════════════════════════════════════════ */}
        {step === "revisao" && (
          <div style={{ animation: "fadeUp .4s ease", paddingTop: 48 }}>
            <span style={tag}>04 — Finalizar</span>
            <h2 style={{ fontSize: "clamp(24px,6vw,36px)", fontWeight: 200, marginBottom: 12 }}>
              Tudo certo, {firstName}.
            </h2>
            <p style={{ fontSize: 14, color: C.gray, lineHeight: 1.75, marginBottom: 36 }}>
              Suas respostas foram registradas. Clique abaixo para gerar sua análise.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 36 }}>
              {QUESTIONS.map((q, i) => (
                <div key={i} style={{ border: `1px solid ${C.dark}`, padding: "14px 18px" }}>
                  <div style={{ fontSize: 10, color: C.gray, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
                    {i + 1} / {QUESTIONS.length}
                  </div>
                  <div style={{ fontSize: 13, color: C.light, lineHeight: 1.5 }}>
                    {answers[i] || "—"}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn-primary"
              style={{ ...btnPrimary, marginTop: 0 }}
              onClick={() => runAnalysis(answers)}
            >
              Gerar minha análise →
            </button>
            <button
              style={btnOutline}
              onClick={() => { setCurrentQ(0); setAnswers({}); setStep("perguntas"); }}
            >
              Refazer perguntas
            </button>
          </div>
        )}

        {/* ══ ANALISANDO ═══════════════════════════════════════════════════ */}
        {step === "analisando" && (
          <div style={{ textAlign: "center", paddingTop: 100, animation: "fadeUp .4s ease" }}>
            <div style={{ width: 64, height: 64, border: `1px solid ${C.dark}`, borderTop: `1px solid ${C.white}`, borderRadius: "50%", margin: "0 auto 40px", animation: "spin 1.2s linear infinite" }} />
            <h2 style={{ fontSize: 24, fontWeight: 200, marginBottom: 12 }}>Lendo sua imagem</h2>
            <p style={{ fontSize: 13, color: C.gray, lineHeight: 1.8, animation: "breathe 2.5s ease infinite" }}>
              Identificando o formato do rosto<br />e cruzando com suas respostas...
            </p>
          </div>
        )}

        {/* ══ RESULTADO ════════════════════════════════════════════════════ */}
        {step === "resultado" && faceData && (
          <div style={{ animation: "fadeUp .5s ease", paddingTop: 48 }}>

            <span style={tag}>Resultado — {firstName}</span>

            {/* Formato */}
            <div style={{ position: "relative", overflow: "hidden", background: C.dark, padding: "40px 32px 36px", marginBottom: 16 }}>
              <SevenDecor color="#ffffff" opacity={0.05} size={220} />
              <div style={{ fontSize: 10, letterSpacing: "0.35em", color: C.gray, textTransform: "uppercase", marginBottom: 10 }}>
                Formato de rosto identificado
              </div>
              <div style={{ fontSize: "clamp(52px,12vw,80px)", fontWeight: 200, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 8 }}>
                {faceData.label}
              </div>
              <div style={{ fontSize: 13, color: C.gray, fontStyle: "italic", marginBottom: 24 }}>
                {faceData.tagline}
              </div>
              <div style={{ width: 40, height: 1, background: C.gray, marginBottom: 20 }} />
              <p style={{ fontSize: 14, color: C.light, lineHeight: 1.75 }}>
                {faceData.desc}
              </p>
            </div>

            {/* Mensagem personalizada */}
            {resultado.mensagem_personalizada && (
              <div style={{ border: `1px solid ${C.mid}`, padding: "28px 28px", marginBottom: 16 }}>
                <span style={{ ...tag, marginBottom: 16 }}>Leitura do seu momento</span>
                <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, fontStyle: "italic", color: C.light }}>
                  "{resultado.mensagem_personalizada}"
                </p>
              </div>
            )}

            {/* Diretrizes */}
            <div style={{ background: C.dark, padding: "32px 28px", marginBottom: 16 }}>
              <span style={{ ...tag, marginBottom: 20 }}>Diretrizes de visagismo capilar</span>
              {faceData.hair.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "13px 0", borderBottom: i < faceData.hair.length - 1 ? `1px solid ${C.mid}` : "none" }}>
                  <ArrowBox />
                  <span style={{ fontSize: 14, color: C.light, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop: 24, borderTop: `1px solid ${C.mid}`, paddingTop: 20 }}>
                <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.gray }}>Atenção — </span>
                <span style={{ fontSize: 13, color: C.gray, fontStyle: "italic", lineHeight: 1.6 }}>{faceData.evitar}</span>
              </div>
            </div>

            {/* CTA */}
            <div style={{ padding: "36px 0 0" }}>
              <span style={tag}>Próximo passo</span>
              <h3 style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: 200, lineHeight: 1.3, marginBottom: 16 }}>
                Esse foi o raio-x superficial.
              </h3>
              <p style={{ fontSize: 14, color: C.gray, lineHeight: 1.8, marginBottom: 32 }}>
                A consultoria completa da The Set vai além do cabelo — alinha imagem, comunicação e percepção. É quando você para de ajustar e começa a construir.
              </p>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{ ...btnPrimary, marginTop: 0 }}>
                  Quero agendar minha reunião estratégica
                </button>
              </a>
              <p style={{ fontSize: 11, color: C.mid, textAlign: "center", marginTop: 14, letterSpacing: "0.08em" }}>
                Você será direcionada para o WhatsApp da The Set
              </p>
            </div>

            {/* Rodapé */}
            <div style={{ marginTop: 64, paddingTop: 28, borderTop: `1px solid ${C.dark}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 400, letterSpacing: "0.08em" }}>the set.</div>
                <div style={{ fontSize: 9, letterSpacing: "0.3em", color: C.mid, textTransform: "uppercase", marginTop: 4 }}>
                  @theset.studio
                </div>
              </div>
              <div style={{ fontSize: 9, color: C.mid, letterSpacing: "0.15em", textAlign: "right" }}>
                MARCA ✦ IMAGEM<br />PRESENÇA ✦ COMUNICAÇÃO
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
