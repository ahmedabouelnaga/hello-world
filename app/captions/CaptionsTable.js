'use client'

import VoteControls from './VoteControls'

export default function CaptionsTable({ captions, voteCounts, userVotes, user }) {
  return (
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
      <table style={{
        borderCollapse: 'collapse',
        width: '100%',
        border: '1px solid #ddd',
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Caption</th>
            <th style={thStyle}>Rate</th>
          </tr>
        </thead>
        <tbody>
          {captions.map((caption, index) => {
            const counts = voteCounts[caption.id] || { upvotes: 0, downvotes: 0 }
            const userVote = userVotes[caption.id] || null
            const imageUrl = caption.images?.url || null

            return (
              <tr key={caption.id} style={{
                backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9',
              }}>
                <td style={tdStyle}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Caption image"
                      style={{ width: '150px', height: 'auto', borderRadius: '4px' }}
                    />
                  ) : (
                    <span style={{ color: '#999' }}>No image</span>
                  )}
                </td>
                <td style={tdStyle}>
                  {caption.content}
                </td>
                <td style={tdStyle}>
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
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const thStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold',
}

const tdStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  verticalAlign: 'middle',
}
