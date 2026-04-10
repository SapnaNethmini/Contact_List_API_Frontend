// src/types/index.ts
// These are the shapes of the data we get from the Go backend.
// They match the json field names in the Go structs.

export type User = {
  ID: number
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export type Contact = {
  ID: number
  userId: number
  name: string
  phone?: string      
  email?: string
  address?: string
  tags?: string        
  notes?: string
  createdAt: string
  updatedAt: string
}
