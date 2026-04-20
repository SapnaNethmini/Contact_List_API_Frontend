'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApi } from '@/lib/useApi'
import { useAuth } from '@/context/AuthContext'
import { Contact } from '@/types'
import ContactCard from '@/components/ContactCard'
import ContactForm from '@/components/ContactForm'

export default function ContactsPage() {
  const router  = useRouter()
  const api     = useApi()
  const { isLoggedIn, refreshToken, logout } = useAuth()

  const [contacts, setContacts] = useState<Contact[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchText, setSearchText] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  // State for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)
  const [deleteMessage, setDeleteMessage] = useState('')

  // redirect to /login if not logged in
  useEffect(() => {
    if (!isLoggedIn) router.replace('/login')
  }, [isLoggedIn, router])

  useEffect(() => { loadContacts() }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText.trim()) searchContacts(searchText)
      else loadContacts()
    }, 400)
    return () => clearTimeout(timer)
  }, [searchText])

  async function loadContacts() {
    setLoading(true)
    setError('')
    try {
      const data = await api('/contacts')
      setContacts(data.data || [])
      setTotal(data.total || 0)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not load contacts')
    } finally {
      setLoading(false)
    }
  }

  async function searchContacts(query: string) {
    setLoading(true)
    setError('')
    try {
      const data = await api(`/contacts/search?q=${encodeURIComponent(query)}`)
      setContacts(data.results || [])
      setTotal(data.count || 0)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  //  open modal
  function confirmDelete(contact: Contact) {
    setContactToDelete(contact) 
    setDeleteModalOpen(true)
  }

 

  async function handleDelete() {
  if (!contactToDelete) return
  try {
    await api(`/contacts/${contactToDelete.ID}`, 'DELETE')
    setDeleteMessage('Contact successfully deleted!')
    loadContacts() // refresh contacts
    setTimeout(() => setDeleteMessage(''), 1500)
  } catch {
    setDeleteMessage('Could not delete')
    setTimeout(() => setDeleteMessage(''), 1500)
  } finally {
    setDeleteModalOpen(false)
    setContactToDelete(null)
  }
  }


  function openEditForm(contact: Contact) {
    setEditingContact(contact)
    setShowForm(true)
  }

  function openAddForm() {
    setEditingContact(null)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditingContact(null)
    loadContacts()
  }

  async function handleLogout() {
    try {
      if (refreshToken) await api('/auth/logout', 'POST', { refreshToken })
    } catch {}
    logout()
    router.replace('/login')
  }

  return (
   
    //<div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400">

<div className="min-h-screen bg-[url('/images/background7.jpg')] bg-no-repeat bg-center bg-cover bg-fixed relative">
 
  <div className="absolute inset-0 bg-black/50"></div>
  <div className="relative z-10">
   
   
  <nav className="bg-gray-300 border-b border-gray-300">
  <div className="w-full px-6 h-16 flex items-center justify-between">
    
    {/* Left side */}
    <div className="flex items-center gap-2">
      <img
        src="/images/contact_list.jpg"
        alt="Contact List"
        className="w-8 h-8 rounded-full object-cover"
      />
      <span className="font-bold text-gray-900 text-lg">
        CONTACT LIST
      </span>
    </div>

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="bg-black hover:bg-gray-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
    >
      Log Out
    </button>    
    </div>
  </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="text-m text-gray-700 mt-0.5">{total} contact{total !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={openAddForm}
            className="bg-black border border-transparent hover:bg-gray-600 hover:border-gray-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <span className="text-lg leading-none">+</span> Add contact
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && contacts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">{searchText ? `No results for "${searchText}"` : 'No contacts yet'}</p>
            {!searchText && (
              <p className="text-sm mt-1">Click "Add contact" to get started</p>
            )}
          </div>
        )}

  
        {deleteMessage && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg text-sm">
            {deleteMessage}
          </div>
        )}

        {!loading && contacts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.ID ?? contact.email}
                contact={contact}
                onEdit={() => openEditForm(contact)}
                onDelete={() => confirmDelete(contact)}
              />
            ))}
          </div>
        )}

        {showForm && (
          <ContactForm
            contact={editingContact}
            onClose={handleFormClose}
          />
        )}

        {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          
      <h3 className="text-lg font-semibold mb-4">Delete Contact?</h3>
      
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this contact?
      </p>

      <div className="flex justify-end gap-3">
        
        {/* Cancel Button */}
        <button
          onClick={() => setDeleteModalOpen(false)}
          className="flex-1 bg-gray-300 text-black text-sm py-2 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 transition"
        >
          Cancel
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="flex-1 bg-black text-white text-sm py-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:text-red-600 transition"
        >
          Delete
        </button>

      </div>
    </div>
  </div>
)}

    </div>
  </div>
</div>
  )
}