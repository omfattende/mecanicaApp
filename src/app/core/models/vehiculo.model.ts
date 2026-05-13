export interface Vehiculo {
  id: number;
  usuario_id: number;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  color?: string;
  kilometraje?: number;
  created_at?: string;
  updated_at?: string;
  
  // Relaciones
  usuario?: {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
  };
  _count?: {
    citas: number;
  };
}

export interface CreateVehiculoRequest {
  usuario_id: number;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  color?: string;
  kilometraje?: number;
}

export interface UpdateVehiculoRequest {
  marca?: string;
  modelo?: string;
  anio?: number;
  color?: string;
  kilometraje?: number;
}
