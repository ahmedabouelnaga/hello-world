import { createSupabaseServerClient } from '@/lib/supabase-server'
import SignOutButton from './SignOutButton'
import CaptionsTable from './CaptionsTable'

export default async function CaptionsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: captions, error } = await supabase
    .from('captions')
    .select('*, images(url)')

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Captions</h1>
        <p style={{ color: 'red' }}>Error loading captions: {error.message}</p>
      </div>
    )
  }

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
      // Track the current user's vote per caption
      if (user && v.profile_id === user.id) {
        userVotes[v.caption_id] = v.vote_value
      }
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h1 style={{ margin: 0 }}>Captions</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user && (
            <span style={{ fontSize: '14px', color: '#555' }}>
              {user.email}
            </span>
          )}
          <SignOutButton />
        </div>
      </div>

      {!captions || captions.length === 0 ? (
        <p>No captions found.</p>
      ) : (
        <>
          <p>Total records: {captions.length}</p>
          <CaptionsTable captions={captions} voteCounts={voteCounts} userVotes={userVotes} user={user} />
        </>
      )}
    </div>
  )
}
