import { createSupabaseServerClient } from '@/lib/supabase-server'
import CaptionsList from './CaptionsList'

export default async function CaptionsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch captions with their image URL via foreign key join
  const { data: captions, error } = await supabase
    .from('captions')
    .select('*, images(url)')

  if (error) {
    return (
      <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
        <h1>Captions</h1>
        <p style={{ color: 'red' }}>Error loading captions: {error.message}</p>
      </div>
    )
  }

  // Only show captions that have an accessible image
  const captionsWithImages = captions.filter(c => c.images && c.images.url)

  // Fetch all votes to compute counts per caption
  const { data: votes } = await supabase
    .from('caption_votes')
    .select('caption_id, vote_value, profile_id')

  const voteCounts = {}
  const userVotes = {}
  if (votes) {
    for (const v of votes) {
      if (!voteCounts[v.caption_id]) {
        voteCounts[v.caption_id] = { upvotes: 0, downvotes: 0 }
      }
      if (v.vote_value === 1) {
        voteCounts[v.caption_id].upvotes++
      } else if (v.vote_value === -1) {
        voteCounts[v.caption_id].downvotes++
      }
      if (user && v.profile_id === user.id) {
        userVotes[v.caption_id] = v.vote_value
      }
    }
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#1a202c' }}>Captions</h1>
        <span style={{ fontSize: '14px', color: '#718096' }}>
          {captionsWithImages.length} caption{captionsWithImages.length !== 1 ? 's' : ''}
        </span>
      </div>

      {!captionsWithImages || captionsWithImages.length === 0 ? (
        <p style={{ color: '#718096', textAlign: 'center', marginTop: '60px' }}>No captions found.</p>
      ) : (
        <CaptionsList captions={captionsWithImages} voteCounts={voteCounts} userVotes={userVotes} user={user} />
      )}
    </div>
  )
}
