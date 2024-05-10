
export interface Device {
    id: number
    item_name: string
    description: string
    annotation?: string
    location: string
    location_id: number
    borrowed_by_user_id?: number
    user_name?: string
    user_type?: string
    user_email?: string
}
  
export interface DeviceQRData {
    id: number
    deviceType: string
    deviceVariant: string
}

export interface RoomQRData {
    id: number
    room_number: string
}

export interface DownloadFileName {
    id: number | string
    name: string
}
export interface NewDeviceData {
    product_type: ProductType
    current_room: Room
    annotation: string
}
  
export interface ProductType {
    id: number | null
    name: string
    description: string
}
  
export interface Room {
    id: number | null
    room_number: string
}
  
export interface ImageResponse {
    id: number
    unix_time: number
    file_name: string
    device_id: number
    image: string
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: Usertype;
  password_hash: string;
}

export interface ItemHistoryPost {
  item: number;
  user: number;
  item_history_type: number;
  room: number;
}

interface Usertype {
  id: number;
  name: string;
}