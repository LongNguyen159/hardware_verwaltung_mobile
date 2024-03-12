export interface DeviceInput {
    deviceName: string
    deviceLocation: string
}

export interface DeviceMetaData {
    id: number,
    deviceName: string,
    location: string,
    inLage: string,
    duration: string
}

export interface QrData {
  id: number
  name: string
}

export interface DeviceMetaData1 {
  id: number,
  product_type: {
    id: number,
    name: string,
    description?: string
  },
  current_room: {
    id: number,
    room_number: string
  },
  annotation?: string
  borrowed_by_user: {
    first_name: string,
    last_name: string,
    email: string,
    user_type: string | null,
    password_hash: string
  },
  qr_code?: string
}