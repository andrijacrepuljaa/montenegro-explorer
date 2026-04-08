import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { Search, MapPin } from "lucide-react";

const MONTENEGRO = { lat: 42.5, lng: 19.3, name: "Montenegro" };

const countries = [
  { name: "Germany", lat: 51.2, lng: 10.4 },
  { name: "United Kingdom", lat: 55.4, lng: -3.4 },
  { name: "France", lat: 46.6, lng: 2.2 },
  { name: "Italy", lat: 41.9, lng: 12.5 },
  { name: "Spain", lat: 40.5, lng: -3.7 },
  { name: "Netherlands", lat: 52.1, lng: 5.3 },
  { name: "Switzerland", lat: 46.8, lng: 8.2 },
  { name: "Austria", lat: 47.5, lng: 14.6 },
  { name: "Belgium", lat: 50.5, lng: 4.5 },
  { name: "Sweden", lat: 60.1, lng: 18.6 },
  { name: "Norway", lat: 60.5, lng: 8.5 },
  { name: "Denmark", lat: 56.3, lng: 9.5 },
  { name: "Poland", lat: 51.9, lng: 19.1 },
  { name: "Czech Republic", lat: 49.8, lng: 15.5 },
  { name: "Portugal", lat: 39.4, lng: -8.2 },
  { name: "Serbia", lat: 44.0, lng: 21.0 },
  { name: "Croatia", lat: 45.1, lng: 15.2 },
  { name: "Slovenia", lat: 46.2, lng: 14.9 },
  { name: "Bosnia", lat: 43.9, lng: 17.7 },
  { name: "Romania", lat: 45.9, lng: 24.9 },
  { name: "Hungary", lat: 47.2, lng: 19.5 },
  { name: "Greece", lat: 39.1, lng: 21.8 },
  { name: "Turkey", lat: 39.9, lng: 32.9 },
  { name: "United States", lat: 37.1, lng: -95.7 },
  { name: "Canada", lat: 56.1, lng: -106.3 },
  { name: "Brazil", lat: -14.2, lng: -51.9 },
  { name: "Japan", lat: 36.2, lng: 138.3 },
  { name: "South Korea", lat: 35.9, lng: 127.8 },
  { name: "China", lat: 35.9, lng: 104.2 },
  { name: "India", lat: 20.6, lng: 79.0 },
  { name: "Australia", lat: -25.3, lng: 133.8 },
  { name: "UAE", lat: 23.4, lng: 53.8 },
  { name: "South Africa", lat: -30.6, lng: 22.9 },
  { name: "Singapore", lat: 1.4, lng: 103.8 },
  { name: "Ireland", lat: 53.1, lng: -7.7 },
  { name: "Finland", lat: 61.9, lng: 25.7 },
];

function toXY(lat: number, lng: number, w: number, h: number) {
  const x = ((lng + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return { x, y };
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const W = 900;
const H = 500;

const InteractiveGlobe = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<(typeof countries)[0] | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => (search ? countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())) : []),
    [search]
  );

  const me = toXY(MONTENEGRO.lat, MONTENEGRO.lng, W, H);

  return (
    <section id="map" className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12" ref={ref}>
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="accent-bar mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Global Reach
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Based in Montenegro, delivering results worldwide. Select a country to see the connection.
            </p>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full pl-10 pr-4 py-2.5 border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              {filtered.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-background border border-border border-t-0 max-h-48 overflow-auto z-20 shadow-lg">
                  {filtered.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => { setSelected(c); setSearch(""); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border p-5 bg-background"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{selected.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Distance from Montenegro:{" "}
                  <span className="font-bold text-primary text-lg">
                    {getDistance(MONTENEGRO.lat, MONTENEGRO.lng, selected.lat, selected.lng).toLocaleString()} km
                  </span>
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
              {Array.from({ length: 19 }).map((_, i) => {
                const y = (i / 18) * H;
                return <line key={`h${i}`} x1={0} y1={y} x2={W} y2={y} stroke="hsl(220 13% 91%)" strokeWidth={0.5} />;
              })}
              {Array.from({ length: 37 }).map((_, i) => {
                const x = (i / 36) * W;
                return <line key={`v${i}`} x1={x} y1={0} x2={x} y2={H} stroke="hsl(220 13% 91%)" strokeWidth={0.5} />;
              })}

              {countries.map((c) => {
                const p = toXY(c.lat, c.lng, W, H);
                const isSelected = selected?.name === c.name;
                return (
                  <g key={c.name} onClick={() => setSelected(c)} className="cursor-pointer">
                    <circle cx={p.x} cy={p.y} r={isSelected ? 7 : 4} fill={isSelected ? "hsl(213 72% 31%)" : "hsl(213 72% 31% / 0.3)"} className="transition-all duration-300" />
                    {isSelected && (
                      <>
                        <circle cx={p.x} cy={p.y} r={12} fill="none" stroke="hsl(213 72% 31%)" strokeWidth={1} opacity={0.4} />
                        <text x={p.x} y={p.y - 16} textAnchor="middle" fill="hsl(220 20% 10%)" fontSize={11} fontWeight={600}>{c.name}</text>
                      </>
                    )}
                  </g>
                );
              })}

              <circle cx={me.x} cy={me.y} r={6} fill="hsl(213 72% 31%)" />
              <circle cx={me.x} cy={me.y} r={12} fill="none" stroke="hsl(213 72% 31%)" strokeWidth={1.5} opacity={0.5} />
              <text x={me.x} y={me.y - 18} textAnchor="middle" fill="hsl(213 72% 31%)" fontSize={11} fontWeight={700}>Montenegro</text>

              {selected && (() => {
                const sp = toXY(selected.lat, selected.lng, W, H);
                return (
                  <line x1={me.x} y1={me.y} x2={sp.x} y2={sp.y} stroke="hsl(213 72% 31%)" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.6} />
                );
              })()}
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveGlobe;
