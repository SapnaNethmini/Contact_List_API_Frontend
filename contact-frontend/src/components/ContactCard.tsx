import { Contact } from '@/types'
import Image from "next/image"


type Props = {
  contact: Contact
  onEdit: () => void
  onDelete: () => void
}

// function initials(name: string) {
//   return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
// }

// Pick a background color based on the name (so each contact has a consistent color)
// const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500']
// function avatarColor(name: string) {
//   let hash = 0
//   for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i)
//   return colors[hash % colors.length]
// }

export default function ContactCard({ contact, onEdit, onDelete }: Props) {
  // Parse tags from "work,friend" string to ["work", "friend"] array

  const tagList =
  contact.tags && contact.tags !== "null"
    ? Array.isArray(contact.tags)
      ? contact.tags
      : typeof contact.tags === "string"
      ? contact.tags.split(',').filter(Boolean)
      : []
    : [];


return (
  <div className="bg-gray-300 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200">
    
    {/* Top Section (Profile Area) */}
    <div className="flex flex-col items-center text-center p-1 bg-gray-100">

      {/* Profile Image / Avatar */}
      {/* <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold text-white shadow-sm">
        {initials(contact.name)}
      </div> */}

      <Image
        src="/images/image.png"
        alt="User"
        width={64}
        height={64}
        className="rounded-full object-cover"
      />
      {/* Name */}
      <h2 className="mt-2 text-base font-semibold text-gray-900">
        {contact.name}
      </h2>

      {/* Email */}
      {contact.email && (
        <p className="text-sm text-gray-500 mt-1">
          {contact.email}
        </p>
      )}
    </div>

    {/* Middle Section (Details Grid) */}
    <div className="grid grid-cols-2 gap-3 px-5 py-4 text-sm text-gray-600">
       
        <div>
          <p className="text-xs text-gray-400">Phone</p>
          <p className="font-medium text-gray-800">{contact.phone}</p>
        </div>
      


        <div>
        <p className="text-xs text-gray-400">Address</p>
        <p className="font-medium text-gray-800">
          {contact.address || "-"}
        </p>
        </div>


    <div className="col-span-2">
    <p className="text-xs text-gray-400 mb-1">Tags</p>
    {tagList.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {tagList.map((tag, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs border border-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">-</p>
      )}
    </div>

      
    <div className="col-span-2">
          <p className="text-xs text-gray-400">Notes</p>
          <p className="text-gray-600 text-xs mt-1 line-clamp-2">
            {contact.notes || "-"}
          </p>
    </div>
    </div>

    {/* Bottom Section  */}
    <div className="bg-gray-100 px-5 py-3 flex gap-2">
      
      <button
        onClick={onEdit}
        className="flex-1 bg-black text-white text-sm py-2 rounded-lg border border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition"
      >
        Edit
      </button>

      <button
        onClick={onDelete}
        className="flex-1 bg-black text-white text-sm py-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:text-red-600 transition"
      >
        Delete
      </button>

    </div>
  </div>
)


}
