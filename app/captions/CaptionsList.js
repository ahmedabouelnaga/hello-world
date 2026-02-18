'use client'

import VoteControls from './VoteControls'

export default function CaptionsList({ captions, voteCounts, userVotes, user }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '20px',
      marginTop: '20px',
    }}>
      {captions.map((caption) => {
        const counts = voteCounts[caption.id] || { upvotes: 0, downvotes: 0 }
        const userVote = userVotes[caption.id] || null

        return (
          <div key={caption.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <img
              src={caption.images.url}
              alt=""
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5', flex: 1 }}>
                {caption.content}
              </p>

              <div>
                {user ? (
                  <VoteControls
                    captionId={caption.id}
                    upvotes={counts.upvotes}
                    downvotes={counts.downvotes}
                    userVote={userVote}
                  />
                ) : (
                  <span style={{ color: '#999', fontSize: '13px' }}>
                    Log in to vote
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
