
export interface DeviceMetaData {
  id: number
  item_name: string
  description?: string
  annotation?: string
  location: string
  borrowed_by_user_id?: number
  user_name?: string
  user_type?: string
  user_email?: string
}

export interface QrData {
  id: number
  deviceName: string
}

export interface NewDeviceData {
  product_type: ProductType
  current_room: RoomInterface
  annotation: string
}

export interface ProductType {
  id: number | null
  name: string
  description: string
}

export interface RoomInterface {
  id: number | null
  room_number: string
}