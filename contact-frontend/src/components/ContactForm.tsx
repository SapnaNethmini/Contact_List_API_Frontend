// A popup modal form for adding or editing a contact

'use client'

import { useState, useEffect } from 'react'
import { useApi } from '@/lib/useApi'
import { Contact } from '@/types'

type Props = {
  contact: Contact | null
  onClose: () => void
}

export default function ContactForm({ contact, onClose }: Props) {
  const api       = useApi()  
  const isEditing = contact !== null

  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [email, setEmail]     = useState('')
  const [address, setAddress] = useState('')
  const [tags, setTags]       = useState('')
  const [notes, setNotes]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (contact) {
      setName(contact.name || '')
      setPhone(contact.phone || '')
      setEmail(contact.email || '')
      setAddress(contact.address || '')
      //setTags(contact.tags ? contact.tags.split(',').filter(Boolean).join(', ') : '')
      setTags(contact.tags && Array.isArray(contact.tags) ? contact.tags.filter(Boolean).join(', ') : '')
      setNotes(contact.notes || '')
    }
  }, [contact])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const tagArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
    const payload  = { name, phone, email, address, tags: tagArray, notes }

    try {
      if (isEditing) {
        //console.log('Editing contact:', contact)
        await api(`/contacts/${contact!.ID}`, 'PUT', payload)
      } else {
        await api('/contacts', 'POST', payload)
      }
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not save contact')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {isEditing ? 'Edit contact' : 'Add new contact'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bob Jones"
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label> */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
               Phone Number <span className="text-red-500">*</span>
              </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+94771234567"
              required
              pattern="^\+?\d{1,3}?\d{7,12}$"
              title="Enter a valid phone number, e.g. +94771234567 or 0712345678"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bob@example.com"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, Colombo"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags <span className="text-gray-400 font-normal">(comma separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="work, friend, client"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this contact..."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black hover:bg-gray-500 disabled:opacity-60 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition"
            >
              {loading ? 'Saving...' : isEditing ? 'Save changes' : 'Add contact'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
