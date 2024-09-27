'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Content {
  id: string;
  folder_id: string;
  title: string;
  content?: string;
  created_at: string;
}

export default function FolderContents() {
  const { id } = useParams()
  const [contents, setContents] = useState<Content[]>([])
  const [newContentTitle, setNewContentTitle] = useState('')
  const [newContentBody, setNewContentBody] = useState('')

  // Memoize fetchContents with useCallback
  const fetchContents = useCallback(async () => {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .eq('folder_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contents:', error)
    } else {
      setContents(data || [])
    }
  }, [id]) // Include 'id' as a dependency

  useEffect(() => {
    fetchContents()
  }, [fetchContents]) // Fetch contents when fetchContents or id changes

  async function createContent(e: React.FormEvent) {
    e.preventDefault()
    if (!newContentTitle.trim()) return

    const { error } = await supabase
      .from('contents')
      .insert([{ 
        folder_id: id, 
        title: newContentTitle.trim(),
        content: newContentBody.trim()
      }])
      .select()

    if (error) {
      console.error('Error creating content:', error)
    } else {
      setNewContentTitle('')
      setNewContentBody('')
      fetchContents()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-black mb-4">Folder Contents</h1>
      <form onSubmit={createContent} className="mb-4">
        <input
          type="text"
          value={newContentTitle}
          onChange={(e) => setNewContentTitle(e.target.value)}
          placeholder="Content title"
          className="border p-2 text-black mr-2 mb-2 block w-full"
        />
        <textarea
          value={newContentBody}
          onChange={(e) => setNewContentBody(e.target.value)}
          placeholder="Content body"
          className="border p-2 text-black mr-2 mb-2 block w-full h-32"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Content
        </button>
      </form>
      <ul>
        {contents.map((content) => (
          <li key={content.id} className="mb-4 border-b pb-2">
            <h2 className="text-xl text-black font-semibold">{content.title}</h2>
            <p className="text-black">{content.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
