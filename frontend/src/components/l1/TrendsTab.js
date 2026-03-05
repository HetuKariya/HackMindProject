import { useState, useEffect } from "react";
import axios from "axios";

const CITIES = [
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Jaipur",
  "Ahmedabad",
  "Noida",
];
const ROLES = [
  "Data Entry",
  "BPO",
  "Data Analyst",
  "Software Engineer",
  "Customer Support",
  "Content Writer",
  "HR Executive",
  "Accountant",
  "Sales Executive",
  "Digital Marketing",
];
const WINDOWS = [7, 30, 90, 365];

const TrendsTab = () => {
  const [city, setCity] = useState("");
  const [role, setRole] = useState("");
  const [window, setWindow] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ window });
      if (city) params.append("city", city);
      if (role) params.append("role", role);
      const res = await axios.get(`/api/l1/trends?${params}`);
      setData(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [city, role, window]);

  const pctColor = (pct) =>
    pct < 0 ? "#ff6b6b" : pct > 0 ? "#4ec9b0" : "#a0a0b0";

  // Simple bar chart helper
  const maxCount = data
    ? Math.max(
        ...Object.values(data.series).flatMap((s) => s.map((p) => p.count)),
        1,
      )
    : 1;

  return (
    <div>
      {/* Filters */}
      <div style={s.filters}>
        <select
          style={s.select}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">All Cities</option>
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          style={s.select}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All Roles</option>
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <div style={s.windows}>
          {WINDOWS.map((w) => (
            <button
              key={w}
              style={{ ...s.wBtn, ...(window === w ? s.wActive : {}) }}
              onClick={() => setWindow(w)}
            >
              {w}d
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      {data && (
        <div style={s.cards}>
          <div style={s.card}>
            <div style={s.cardLabel}>Current Postings</div>
            <div style={s.cardVal}>{data.current_total.toLocaleString()}</div>
          </div>
          <div style={s.card}>
            <div style={s.cardLabel}>Previous Period</div>
            <div style={s.cardVal}>{data.previous_total.toLocaleString()}</div>
          </div>
          <div style={{ ...s.card, borderColor: pctColor(data.pct_change) }}>
            <div style={s.cardLabel}>% Change</div>
            <div style={{ ...s.cardVal, color: pctColor(data.pct_change) }}>
              {data.pct_change > 0 ? "+" : ""}
              {data.pct_change}%
            </div>
          </div>
        </div>
      )}

      {/* Bar charts per series */}
      {loading && <p style={s.loading}>Loading trends…</p>}
      {data && Object.keys(data.series).length === 0 && (
        <p style={s.empty}>No data yet. Run the scraper first.</p>
      )}
      {data &&
        Object.entries(data.series).map(([label, points]) => (
          <div key={label} style={s.chart}>
            <div style={s.chartTitle}>{label}</div>
            <div style={s.bars}>
              {points.map((p) => (
                <div key={p.date} style={s.barWrap}>
                  <div
                    style={{
                      ...s.bar,
                      height: `${Math.round((p.count / maxCount) * 80)}px`,
                    }}
                    title={`${p.count} jobs, AI rate: ${(p.ai_rate * 100).toFixed(1)}%`}
                  />
                  <div style={s.barLabel}>{p.date.slice(5)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

const s = {
  filters: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
    alignItems: "center",
  },
  select: {
    background: "#0f0f1a",
    color: "#fff",
    border: "1px solid #2a2a4a",
    borderRadius: "6px",
    padding: "0.4rem 0.8rem",
    fontSize: "0.9rem",
  },
  windows: { display: "flex", gap: "0.25rem" },
  wBtn: {
    background: "#0f0f1a",
    color: "#a0a0b0",
    border: "1px solid #2a2a4a",
    borderRadius: "4px",
    padding: "0.3rem 0.6rem",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  wActive: {
    background: "#e94560",
    color: "#fff",
    border: "1px solid #e94560",
  },
  cards: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
  },
  card: {
    background: "#0f0f1a",
    border: "1px solid #2a2a4a",
    borderRadius: "8px",
    padding: "1rem 1.5rem",
    minWidth: "140px",
  },
  cardLabel: { color: "#a0a0b0", fontSize: "0.8rem", marginBottom: "0.25rem" },
  cardVal: { fontSize: "1.6rem", fontWeight: 700, color: "#fff" },
  chart: {
    background: "#0f0f1a",
    border: "1px solid #2a2a4a",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
  },
  chartTitle: {
    color: "#e94560",
    fontWeight: 600,
    marginBottom: "0.75rem",
    fontSize: "0.9rem",
  },
  bars: {
    display: "flex",
    gap: "4px",
    alignItems: "flex-end",
    height: "100px",
    overflowX: "auto",
  },
  barWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    minWidth: "28px",
  },
  bar: {
    width: "20px",
    background: "#e94560",
    borderRadius: "3px 3px 0 0",
    transition: "height 0.3s",
  },
  barLabel: {
    color: "#a0a0b0",
    fontSize: "0.6rem",
    transform: "rotate(-45deg)",
    transformOrigin: "top center",
    whiteSpace: "nowrap",
  },
  loading: { color: "#a0a0b0", textAlign: "center", padding: "2rem" },
  empty: {
    color: "#a0a0b0",
    textAlign: "center",
    padding: "2rem",
    fontStyle: "italic",
  },
};

export default TrendsTab;
