'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function submitVote(captionId, vote) {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'You must be logged in to vote.' }
  }

  // Check if user already has a vote on this caption
  const { data: existing } = await supabase
    .from('caption_votes')
    .select('id, vote_value')
    .eq('profile_id', user.id)
    .eq('caption_id', captionId)
    .single()

  // If clicking the same vote again, remove it (toggle off)
  if (existing && existing.vote_value === vote) {
    const { error } = await supabase
      .from('caption_votes')
      .delete()
      .eq('id', existing.id)

    if (error) return { error: error.message }
    return { success: true, newVote: null }
  }

  // Otherwise, upsert the new vote
  const { error } = await supabase
    .from('caption_votes')
    .upsert({
      profile_id: user.id,
      caption_id: captionId,
      vote_value: vote,
      created_datetime_utc: new Date().toISOString(),
      modified_datetime_utc: new Date().toISOString(),
    }, { onConflict: 'profile_id,caption_id' })

  if (error) return { error: error.message }
  return { success: true, newVote: vote }
}
