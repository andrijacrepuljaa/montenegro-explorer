import { useState, useRef, useMemo, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import { MapPin } from "lucide-react";
import * as THREE from "three";

const MONTENEGRO = { lat: 42.5, lng: 19.3, name: "Montenegro" };

const countries = [
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
  { name: "Singapore", lat: 1.35, lng: 103.8 },
];

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function GlobePoints({
  selected,
  onSelect,
}: {
  selected: (typeof countries)[0] | null;
  onSelect: (c: (typeof countries)[0]) => void;
}) {
  const montenegroPos = latLngToVec3(MONTENEGRO.lat, MONTENEGRO.lng, 2.01);

  return (
    <>
      {/* Montenegro - always visible */}
      <mesh position={montenegroPos}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#0066cc" />
      </mesh>
      <mesh position={montenegroPos}>
        <ringGeometry args={[0.06, 0.08, 32]} />
        <meshBasicMaterial color="#0066cc" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Country dots */}
      {countries.map((c) => {
        const pos = latLngToVec3(c.lat, c.lng, 2.01);
        const isSelected = selected?.name === c.name;
        return (
          <mesh
            key={c.name}
            position={pos}
            onClick={(e) => { e.stopPropagation(); onSelect(c); }}
          >
            <sphereGeometry args={[isSelected ? 0.04 : 0.025, 16, 16]} />
            <meshBasicMaterial color={isSelected ? "#0066cc" : "#94a3b8"} />
          </mesh>
        );
      })}
    </>
  );
}

function ConnectionArc({
  selected,
}: {
  selected: (typeof countries)[0];
}) {
  const curve = useMemo(() => {
    const start = latLngToVec3(MONTENEGRO.lat, MONTENEGRO.lng, 2.01);
    const end = latLngToVec3(selected.lat, selected.lng, 2.01);
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.6);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [selected]);

  const points = curve.getPoints(64);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial attach="material" color="#0066cc" transparent opacity={0.6} />
    </line>
  );
}

function RotatingGlobe({
  selected,
  onSelect,
}: {
  selected: (typeof countries)[0] | null;
  onSelect: (c: (typeof countries)[0]) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !selected) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Globe sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshPhongMaterial
          color="#e8eef4"
          emissive="#dbeafe"
          emissiveIntensity={0.1}
          transparent
          opacity={0.9}
          wireframe={false}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere args={[2.005, 32, 32]}>
        <meshBasicMaterial color="#cbd5e1" wireframe transparent opacity={0.3} />
      </Sphere>

      <GlobePoints selected={selected} onSelect={onSelect} />
      {selected && <ConnectionArc selected={selected} />}
    </group>
  );
}

const InteractiveGlobe = () => {
  const [selected, setSelected] = useState<(typeof countries)[0] | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [search, setSearch] = useState("");

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
            Select a country on the globe or search below to see the connection to our base.
          </p>
        </motion.div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 relative z-10">
          <input
            type="text"
            placeholder="Search for a country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-body text-sm"
          />
          {filtered.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-background border border-border rounded-lg max-h-48 overflow-y-auto z-20 shadow-lg">
              {filtered.map((c) => (
                <button
                  key={c.name}
                  onClick={() => { setSelected(c); setSearch(""); }}
                  className="w-full text-left px-5 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-2xl border border-border bg-card overflow-hidden"
          style={{ height: "550px" }}
        >
          <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 3, 5]} intensity={0.6} />
            <Suspense fallback={null}>
              <RotatingGlobe selected={selected} onSelect={setSelected} />
            </Suspense>
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              minDistance={3.5}
              maxDistance={8}
              autoRotate={!selected}
              autoRotateSpeed={0.5}
            />
          </Canvas>

          {/* Info card */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 right-6 bg-background/90 backdrop-blur-md border border-border rounded-xl p-5 max-w-xs shadow-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-display font-semibold text-sm">{selected.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Distance from Montenegro:{" "}
                <span className="text-primary font-semibold">
                  {getDistance(MONTENEGRO.lat, MONTENEGRO.lng, selected.lat, selected.lng).toLocaleString()} km
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Serving clients globally with the same dedication as local partners.
              </p>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-primary mt-2 hover:underline"
              >
                Clear selection
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveGlobe;
