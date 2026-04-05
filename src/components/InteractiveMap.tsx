import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin } from "lucide-react";

// Montenegro coordinates (roughly center of the country)
const MONTENEGRO = { lat: 42.5, lng: 19.3, name: "Montenegro" };

// A curated list of countries with approximate lat/lng centers
const countries: { name: string; lat: number; lng: number }[] = [
  { name: "Germany", lat: 51.2, lng: 10.4 },
  { name: "France", lat: 46.6, lng: 2.2 },
  { name: "United Kingdom", lat: 54.0, lng: -2.0 },
  { name: "Italy", lat: 41.9, lng: 12.5 },
  { name: "Spain", lat: 40.5, lng: -3.7 },
  { name: "Netherlands", lat: 52.1, lng: 5.3 },
  { name: "Switzerland", lat: 46.8, lng: 8.2 },
  { name: "Austria", lat: 47.5, lng: 14.6 },
  { name: "Sweden", lat: 60.1, lng: 18.6 },
  { name: "Norway", lat: 60.5, lng: 8.5 },
  { name: "Denmark", lat: 56.3, lng: 9.5 },
  { name: "Poland", lat: 52.0, lng: 20.0 },
  { name: "Czech Republic", lat: 49.8, lng: 15.5 },
  { name: "Belgium", lat: 50.5, lng: 4.5 },
  { name: "Portugal", lat: 39.4, lng: -8.2 },
  { name: "Greece", lat: 39.1, lng: 21.8 },
  { name: "Croatia", lat: 45.1, lng: 15.2 },
  { name: "Serbia", lat: 44.0, lng: 21.0 },
  { name: "Romania", lat: 45.9, lng: 24.9 },
  { name: "Hungary", lat: 47.2, lng: 19.5 },
  { name: "Bulgaria", lat: 42.7, lng: 25.5 },
  { name: "Ireland", lat: 53.1, lng: -7.7 },
  { name: "Finland", lat: 61.9, lng: 25.7 },
  { name: "Turkey", lat: 38.9, lng: 35.2 },
  { name: "United States", lat: 37.1, lng: -95.7 },
  { name: "Canada", lat: 56.1, lng: -106.3 },
  { name: "Brazil", lat: -14.2, lng: -51.9 },
  { name: "China", lat: 35.9, lng: 104.2 },
  { name: "Japan", lat: 36.2, lng: 138.3 },
  { name: "India", lat: 20.6, lng: 78.9 },
  { name: "Australia", lat: -25.3, lng: 133.8 },
  { name: "South Africa", lat: -30.6, lng: 22.9 },
  { name: "UAE", lat: 23.4, lng: 53.8 },
  { name: "Saudi Arabia", lat: 23.9, lng: 45.1 },
  { name: "South Korea", lat: 35.9, lng: 127.8 },
  { name: "Mexico", lat: 23.6, lng: -102.6 },
  { name: "Argentina", lat: -38.4, lng: -63.6 },
  { name: "Egypt", lat: 26.8, lng: 30.8 },
  { name: "Nigeria", lat: 9.1, lng: 8.7 },
  { name: "Kenya", lat: -0.02, lng: 37.9 },
  { name: "Singapore", lat: 1.35, lng: 103.8 },
  { name: "Malaysia", lat: 4.2, lng: 101.9 },
  { name: "Thailand", lat: 15.9, lng: 100.9 },
  { name: "Vietnam", lat: 14.1, lng: 108.3 },
  { name: "Indonesia", lat: -0.8, lng: 113.9 },
  { name: "Russia", lat: 61.5, lng: 105.3 },
  { name: "Ukraine", lat: 48.4, lng: 31.2 },
  { name: "Slovakia", lat: 48.7, lng: 19.7 },
  { name: "Slovenia", lat: 46.2, lng: 14.8 },
  { name: "Albania", lat: 41.2, lng: 20.2 },
  { name: "North Macedonia", lat: 41.5, lng: 21.7 },
  { name: "Bosnia and Herzegovina", lat: 43.9, lng: 17.7 },
  { name: "Kosovo", lat: 42.6, lng: 20.9 },
];

// Convert lat/lng to x/y on a simple equirectangular projection
function toXY(lat: number, lng: number, width: number, height: number) {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const W = 900;
const H = 450;

const InteractiveMap = () => {
  const [selected, setSelected] = useState<typeof countries[0] | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [search, setSearch] = useState("");

  const me = toXY(MONTENEGRO.lat, MONTENEGRO.lng, W, H);
  const sel = selected ? toXY(selected.lat, selected.lng, W, H) : null;

  const filtered = search.length > 0
    ? countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <section id="map" className="py-28 relative">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary font-display text-sm uppercase tracking-[0.2em] mb-3">Global Reach</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            From Montenegro to <span className="text-gradient">the World</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Select your country to see the connection to our base in Montenegro.
          </p>
        </motion.div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 relative">
          <input
            type="text"
            placeholder="Search for a country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-body text-sm"
          />
          {filtered.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-lg max-h-48 overflow-y-auto z-20">
              {filtered.map((c) => (
                <button
                  key={c.name}
                  onClick={() => { setSelected(c); setSearch(""); }}
                  className="w-full text-left px-5 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-4"
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Interactive world map">
            {/* Grid lines */}
            {Array.from({ length: 18 }).map((_, i) => (
              <line key={`v${i}`} x1={(i * W) / 18} y1={0} x2={(i * W) / 18} y2={H} stroke="hsl(222 25% 18%)" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={(i * H) / 9} x2={W} y2={(i * H) / 9} stroke="hsl(222 25% 18%)" strokeWidth={0.5} />
            ))}

            {/* Country dots */}
            {countries.map((c) => {
              const pos = toXY(c.lat, c.lng, W, H);
              const isSelected = selected?.name === c.name;
              return (
                <g key={c.name} onClick={() => setSelected(c)} className="cursor-pointer">
                  <circle cx={pos.x} cy={pos.y} r={isSelected ? 6 : 3} fill={isSelected ? "hsl(187 80% 52%)" : "hsl(215 20% 40%)"} className="transition-all duration-300" />
                  {isSelected && (
                    <>
                      <circle cx={pos.x} cy={pos.y} r={12} fill="none" stroke="hsl(187 80% 52%)" strokeWidth={1} opacity={0.4} />
                      <text x={pos.x} y={pos.y - 16} textAnchor="middle" fill="hsl(210 40% 96%)" fontSize={11} fontFamily="Space Grotesk">{c.name}</text>
                    </>
                  )}
                </g>
              );
            })}

            {/* Montenegro marker (always visible) */}
            <circle cx={me.x} cy={me.y} r={6} fill="hsl(187 80% 52%)" />
            <circle cx={me.x} cy={me.y} r={14} fill="none" stroke="hsl(187 80% 52%)" strokeWidth={1.5} className="animate-pulse-glow" />
            <text x={me.x} y={me.y - 18} textAnchor="middle" fill="hsl(187 80% 52%)" fontSize={11} fontWeight={600} fontFamily="Space Grotesk">Montenegro</text>

            {/* Connection line */}
            {sel && selected && (
              <line x1={me.x} y1={me.y} x2={sel.x} y2={sel.y} stroke="hsl(187 80% 52%)" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.7}>
                <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
              </line>
            )}
          </svg>

          {/* Info card */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 right-8 glass rounded-xl p-5 max-w-xs"
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-display font-semibold text-sm">{selected.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Distance from Montenegro: <span className="text-primary font-semibold">{getDistance(MONTENEGRO.lat, MONTENEGRO.lng, selected.lat, selected.lng).toLocaleString()} km</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Serving clients globally with the same dedication as local partners.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveMap;
