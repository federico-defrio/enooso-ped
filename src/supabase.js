import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')

export async function fetchPosts() {
  if (!supabaseUrl || !supabaseKey) return null
  const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: true })
  if (error) return null
  return data
}

export async function createPost(post) {
  if (!supabaseUrl || !supabaseKey) return null
  const { data, error } = await supabase.from('posts').insert({
    date: post.date, time: post.time, text: post.text, media_type: post.mediaType || 'image',
    image: post.image, carousel: post.carousel, video: post.video, platforms: post.platforms,
    status: post.status, priority: post.priority, tags: post.tags, drive_link: post.driveLink,
    checklist_grafica: post.checklist?.grafica || false, checklist_testo: post.checklist?.testo || false,
    checklist_video: post.checklist?.video || false
  }).select().single()
  return error ? null : data
}

export async function updatePost(id, updates) {
  if (!supabaseUrl || !supabaseKey) return false
  const { error } = await supabase.from('posts').update({
    date: updates.date, time: updates.time, text: updates.text, media_type: updates.mediaType,
    image: updates.image, carousel: updates.carousel, video: updates.video, platforms: updates.platforms,
    status: updates.status, priority: updates.priority, tags: updates.tags, drive_link: updates.driveLink,
    checklist_grafica: updates.checklist?.grafica, checklist_testo: updates.checklist?.testo,
    checklist_video: updates.checklist?.video
  }).eq('id', id)
  return !error
}

export async function deletePost(id) {
  if (!supabaseUrl || !supabaseKey) return false
  const { error } = await supabase.from('posts').delete().eq('id', id)
  return !error
}
