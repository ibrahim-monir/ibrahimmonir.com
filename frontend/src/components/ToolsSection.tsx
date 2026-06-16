const toolGroups = [
  {
    category: "Code Editors",
    tools: [
      {
        name: "VS Code",
        desc: "Primary editor",
        color: "#007ACC",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 19.986V4.014a1.5 1.5 0 0 0-.85-1.427zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
          </svg>
        ),
      },
      {
        name: "PhpStorm",
        desc: "PHP / Laravel IDE",
        color: "#B345F1",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M0 0v24h24V0zm3.723 3.111h4.02c2.423 0 3.912 1.37 3.912 3.347v.03c0 2.229-1.73 3.416-4.093 3.416H5.785v2.931H3.723zm11.617 0h2.207l3.729 9.724h-2.283l-.793-2.147h-3.561l-.793 2.147H11.61zm-9.41 1.714v2.374h1.789c1.129 0 1.822-.56 1.822-1.179v-.03c0-.78-.663-1.165-1.822-1.165zm10.518.573l-1.101 2.99h2.201zM3.723 14.168h8.738v1.712H3.723z"/>
          </svg>
        ),
      },
    ],
  },
  {
    category: "Design & UI",
    tools: [
      {
        name: "Figma",
        desc: "UI / wireframing",
        color: "#F24E1E",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V1.471zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117v-6.038zm4.587-.471h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49-4.49-2.014-4.49-4.49v-4.49zm1.471 4.49c0 1.665 1.355 3.019 3.019 3.019s3.019-1.354 3.019-3.019-1.354-3.019-3.019-3.019h-3.019zm-5.49 2.019H8.148a4.49 4.49 0 0 0 0 8.981c2.476 0 4.49-2.014 4.49-4.49v-4.491zm-4.489 7.51a3.019 3.019 0 1 1 0-6.038v6.038z"/>
          </svg>
        ),
      },
      {
        name: "Tailwind CSS",
        desc: "Utility-first CSS",
        color: "#06B6D4",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
          </svg>
        ),
      },
    ],
  },
  {
    category: "API & Testing",
    tools: [
      {
        name: "Postman",
        desc: "API testing",
        color: "#FF6C37",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M13.527.099C6.955-.744.942 3.9.099 10.473c-.843 6.572 3.8 12.584 10.373 13.428 6.573.843 12.587-3.801 13.428-10.374C24.744 6.955 20.101.943 13.527.099zm2.471 7.485a.855.855 0 0 0-.593.25l-4.453 4.453-.307-.307-.643-.643c4.389-4.376 5.18-4.418 5.996-3.753zm-4.863 4.861l4.44-4.44a.62.62 0 1 1 .877.877l-4.44 4.441-.877-.878zm-1.658 1.657l-.552.551a3.2 3.2 0 0 1-.323.27l-.001.002-.01.007-.012.008a3.171 3.171 0 0 1-1.651.477 3.194 3.194 0 0 1-3.194-3.194 3.19 3.19 0 0 1 1.618-2.78l.003-.001.004-.003.002-.001a3.17 3.17 0 0 1 1.567-.414 3.19 3.19 0 0 1 1.571.414l.003.002.002.001a3.194 3.194 0 0 1 1.618 2.78 3.165 3.165 0 0 1-.646 1.882zm8.58-4.547a.62.62 0 1 1-.877-.877l1.83-1.83a.62.62 0 1 1 .877.877z"/>
          </svg>
        ),
      },
      {
        name: "TablePlus",
        desc: "Database GUI",
        color: "#F6A623",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M12 2C6.477 2 2 4.686 2 8v8c0 3.314 4.477 6 10 6s10-2.686 10-6V8c0-3.314-4.477-6-10-6zm0 2c4.971 0 8 2.239 8 4s-3.029 4-8 4-8-2.239-8-4 3.029-4 8-4zm8 6.764V16c0 1.761-3.029 4-8 4s-8-2.239-8-4v-5.236C5.284 11.887 8.393 13 12 13s6.716-1.113 8-2.236zm0-4.528V10c0 1.761-3.029 4-8 4s-8-2.239-8-4V6.236C5.284 7.887 8.393 9 12 9s6.716-1.113 8-2.764z"/>
          </svg>
        ),
      },
    ],
  },
  {
    category: "DevOps",
    tools: [
      {
        name: "Docker",
        desc: "Containerisation",
        color: "#2496ED",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/>
          </svg>
        ),
      },
      {
        name: "Vercel",
        desc: "Frontend deploy",
        color: "#ffffff",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M24 22.525H0l12-21.05 12 21.05z"/>
          </svg>
        ),
      },
    ],
  },
  {
    category: "Version Control",
    tools: [
      {
        name: "GitHub",
        desc: "Code hosting",
        color: "#f0f6fc",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        ),
      },
      {
        name: "Git",
        desc: "Version control",
        color: "#F05032",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.604-.404-.541-.541-.674-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/>
          </svg>
        ),
      },
    ],
  },
  {
    category: "Productivity",
    tools: [
      {
        name: "Notion",
        desc: "Docs & planning",
        color: "#ffffff",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.047.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
          </svg>
        ),
      },
      {
        name: "Laragon",
        desc: "Local dev env",
        color: "#2ecc71",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 8.5v7L12 19.82 4 15.5v-7L12 4.18zM12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
          </svg>
        ),
      },
    ],
  },

];

const wpBuilders = [
  { name: "Elementor", desc: "Drag & drop builder", color: "#92003B", letter: "E" },
  { name: "Elementor Pro", desc: "Advanced widgets + WooCommerce", color: "#b5003a", letter: "E+" },
  { name: "WPBakery", desc: "Classic visual composer", color: "#E04040", letter: "WB" },
  { name: "Divi Builder", desc: "Front-end & backend editor", color: "#2E76E8", letter: "D" },
  { name: "Beaver Builder", desc: "Reliable page builder", color: "#8EB022", letter: "BB" },
  { name: "Bricks Builder", desc: "Performance-first builder", color: "#DD4444", letter: "Br" },
  { name: "Oxygen Builder", desc: "Code-level visual control", color: "#3E86F5", letter: "O" },
  { name: "Breakdance", desc: "Modern visual builder", color: "#7B2FBE", letter: "BD" },
  { name: "Gutenberg", desc: "Native WP block editor", color: "#21759B", letter: "G" },
  { name: "Kadence Blocks", desc: "Block toolkit for FSE", color: "#2271B1", letter: "KB" },
  { name: "GenerateBlocks", desc: "Lightweight blocks", color: "#4CAF50", letter: "GB" },
  { name: "SeedProd", desc: "Landing page builder", color: "#F04B23", letter: "SP" },
];

export default function ToolsSection() {
  return (
    <section className="py-20" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
      <div className="container">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="badge mb-4 inline-flex">My Toolbox</span>
          <h2 className="section-title mb-4">
            Tools I <span className="gradient-text">Work With</span>
          </h2>
          <p className="section-subtitle mx-auto">
            The software and tools I rely on daily to design, build, and ship great products.
          </p>
        </div>

        {/* Tool groups — 2 rows × 3 cols */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {toolGroups.map((group) => (
            <div key={group.category} className="card p-6">
              <p className="text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: "var(--text-muted)" }}>
                {group.category}
              </p>
              <div className="flex flex-col gap-4">
                {group.tools.map((tool) => (
                  <div key={tool.name} className="flex items-center gap-4">
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                      background: tool.color + "18",
                      border: `1px solid ${tool.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: tool.color,
                    }}>
                      {tool.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{tool.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{tool.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* WordPress Page Builders — full-width card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            {/* WordPress logo mark */}
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: "#21759B18", border: "1px solid #21759B30",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg viewBox="0 0 24 24" fill="#21759B" width="20" height="20">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 1.542c2.407 0 4.601.87 6.302 2.3l-8.714 9.965A8.452 8.452 0 0 1 3.542 12c0-4.671 3.787-8.458 8.458-8.458zm0 16.916a8.417 8.417 0 0 1-4.166-1.104l5.645-16.09A8.458 8.458 0 0 1 20.458 12c0 4.671-3.787 8.458-8.458 8.458z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm">WordPress Page Builders</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Builders I use for client projects & custom WordPress sites
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {wpBuilders.map((b) => (
              <div key={b.name}
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all hover:-translate-y-0.5"
                style={{ background: b.color + "0e", border: `1px solid ${b.color}22` }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12,
                  background: b.color + "20",
                  border: `1px solid ${b.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: b.color, fontSize: "1.1rem", fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}>
                  {b.letter}
                </div>
                <div>
                  <div className="font-semibold text-xs leading-tight">{b.name}</div>
                  <div className="text-xs mt-0.5 leading-tight" style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
