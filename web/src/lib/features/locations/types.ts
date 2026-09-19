export interface ApiLocation {
  id: string;
  name: string;
  province: string;
  city: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  phone?: string | null;
}
