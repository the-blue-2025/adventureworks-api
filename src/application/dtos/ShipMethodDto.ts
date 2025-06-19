export interface ShipMethodDto {
  shipMethodId: number;
  name: string;
  shipBase: number;
  shipRate: number;
}

export interface CreateShipMethodDto {
  name: string;
  shipBase: number;
  shipRate: number;
}

export interface UpdateShipMethodDto {
  name?: string;
  shipBase?: number;
  shipRate?: number;
}

const createDto: CreateShipMethodDto = {
  name: "Express Shipping",
  shipBase: 10.00,
  shipRate: 2.50
};

const updateDto: UpdateShipMethodDto = {
  name: "Premium Express Shipping",
  shipRate: 3.00
};

// Merge with createDto as base, updateDto overriding
const merged = { ...createDto, ...updateDto };
// Result: { name: "Premium Express Shipping", shipBase: 10.00, shipRate: 3.00 }

// Or merge with updateDto as base, createDto providing defaults
const mergedWithDefaults = { ...updateDto, ...createDto };
// Result: { name: "Express Shipping", shipBase: 10.00, shipRate: 2.50 } 