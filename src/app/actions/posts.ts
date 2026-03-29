'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const title = (formData.get('title') as string)?.trim() || null
  const content = (formData.get('content') as string)?.trim() || null
  const resort_id = (formData.get('resort_id') as string) || null
  const image_urls = formData.getAll('image_urls') as string[]

  await supabase.from('posts').insert({
    profile_id: user.id,
    title,
    content,
    resort_id,
    image_urls,
  })

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  if (profile) revalidatePath(`/${profile.username}`)
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('posts').delete().eq('id', postId).eq('profile_id', user.id)

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  if (profile) revalidatePath(`/${profile.username}`)
}
