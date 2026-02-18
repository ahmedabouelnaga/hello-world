'use client'

import { useState } from 'react'
import { submitVote } from './actions'

export default function VoteControls({ captionId, upvotes, downvotes, userVote }) {
  const [currentVote, setCurrentVote] = useState(userVote)
  const [counts, setCounts] = useState({ upvotes, downvotes })
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  async function handleVote(voteValue) {
    setLoading(true)
    setErrorMsg(null)

    const result = await submitVote(captionId, voteValue)

    if (result.error) {
      setErrorMsg(result.error)
    } else {
      const newVote = result.newVote
      // Update counts based on what changed
      setCounts(prev => {
        const updated = { ...prev }

        // Remove old vote from counts
        if (currentVote === 1) updated.upvotes--
        if (currentVote === -1) updated.downvotes--

        // Add new vote to counts
        if (newVote === 1) updated.upvotes++
        if (newVote === -1) updated.downvotes++

        return updated
      })
      setCurrentVote(newVote)
    }

    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        onClick={() => handleVote(1)}
        disabled={loading}
        style={{
          padding: '4px 10px',
          backgroundColor: currentVote === 1 ? '#276749' : '#38a169',
          color: 'white',
          border: currentVote === 1 ? '2px solid #1a4731' : '2px solid transparent',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          opacity: loading ? 0.6 : 1,
          fontWeight: currentVote === 1 ? 'bold' : 'normal',
        }}
      >
        Upvote ({counts.upvotes})
      </button>
      <button
        onClick={() => handleVote(-1)}
        disabled={loading}
        style={{
          padding: '4px 10px',
          backgroundColor: currentVote === -1 ? '#9b2c2c' : '#e53e3e',
          color: 'white',
          border: currentVote === -1 ? '2px solid #63171b' : '2px solid transparent',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          opacity: loading ? 0.6 : 1,
          fontWeight: currentVote === -1 ? 'bold' : 'normal',
        }}
      >
        Downvote ({counts.downvotes})
      </button>
      {errorMsg && (
        <span style={{ color: 'red', fontSize: '12px' }}>{errorMsg}</span>
      )}
    </div>
  )
}
