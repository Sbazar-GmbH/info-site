'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Folder {
  id: string; // UUID
  name: string;
  created_at: string;
}

export default function Folders() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [newFolderName, setNewFolderName] = useState('')

  useEffect(() => {
    fetchFolders()
  }, [])

  async function fetchFolders() {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.error('Error fetching folders:', error)
    else setFolders(data || [])
  }

  async function createFolder(e: React.FormEvent) {
    e.preventDefault()
    if (!newFolderName.trim()) return

    const { error } = await supabase
      .from('folders')
      .insert([{ name: newFolderName.trim() }])
      .select()

    if (error) console.error('Error creating folder:', error)
    else {
      setNewFolderName('')
      fetchFolders()
    }
  }

  return (
    <div className="container mx-auto  p-4">
      <h1 className="text-2xl text-black font-bold mb-4">Folders</h1>
      <form onSubmit={createFolder} className="mb-4">
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name"
          className="border text-black p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Folder
        </button>
      </form>
      <ul>
        {folders.map((folder) => (
          <li key={folder.id} className="mb-2">
            <Link href={`/folders/${folder.id}`} className="text-blue-500 hover:underline">
              {folder.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}