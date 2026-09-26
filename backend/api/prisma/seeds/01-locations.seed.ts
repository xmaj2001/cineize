// ============================================================
// SEED 01 — LOCATIONS (Cidades de Angola)
// ============================================================
import { prisma } from "./_client";
import { SeedConfig } from "./_config";

// Cidades reais de Angola com coordenadas aproximadas
const ANGOLA_CITIES = [
  { name: "Luanda", province: "Luanda", latitude: -8.8368, longitude: 13.2343 },
  {
    name: "Benguela",
    province: "Benguela",
    latitude: -12.5763,
    longitude: 13.4055,
  },
  {
    name: "Huambo",
    province: "Huambo",
    latitude: -12.7761,
    longitude: 15.7389,
  },
  { name: "Lubango", province: "Huíla", latitude: -14.9177, longitude: 13.492 },
  { name: "Cabinda", province: "Cabinda", latitude: -5.55, longitude: 12.1833 },
  {
    name: "Malanje",
    province: "Malanje",
    latitude: -9.5396,
    longitude: 16.3416,
  },
  { name: "Uíge", province: "Uíge", latitude: -7.6085, longitude: 15.0601 },
  { name: "Kuito", province: "Bié", latitude: -12.3833, longitude: 16.9333 },
];

export async function seedLocations(config: SeedConfig) {
  console.log(`   📍 Criando ${config.locations} localidade(s)...`);

  const cities = ANGOLA_CITIES.slice(0, config.locations);

  const locations = await Promise.all(
    cities.map((city) =>
      prisma.location.create({
        data: {
          name: city.name,
          province: city.province,
          country: "Angola",
          latitude: city.latitude,
          longitude: city.longitude,
          active: true,
        },
      }),
    ),
  );

  console.log(`   ✅ ${locations.length} localidade(s) criada(s)`);
  return locations;
}
