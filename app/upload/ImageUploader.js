'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase'

const API_BASE = 'https://api.almostcrackd.ai'

export default function ImageUploader() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [step, setStep] = useState(0)
  const [stepLabel, setStepLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [captions, setCaptions] = useState([])
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null)
  const [flavors, setFlavors] = useState([])
  const [selectedFlavorId, setSelectedFlavorId] = useState(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.from('humor_flavors').select('id, slug, description').order('created_datetime_utc', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setFlavors(data)
          setSelectedFlavorId(data[0].id)
        }
      })
  }, [])

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (!selected) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
    setCaptions([])
    setError(null)
    setStep(0)
  }

  async function handleUpload() {
    if (!file) return

    setLoading(true)
    setError(null)
    setCaptions([])

    const supabase = createSupabaseBrowserClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setError('You must be logged in to upload images.')
      setLoading(false)
      return
    }

    const token = session.access_token
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    try {
      // Step 1: Generate presigned URL
      setStep(1)
      setStepLabel('Getting upload URL...')
      const step1Res = await fetch(`${API_BASE}/pipeline/generate-presigned-url`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ contentType: file.type }),
      })
      if (!step1Res.ok) {
        const errBody = await step1Res.text()
        throw new Error(`Failed to get presigned URL: ${errBody}`)
      }
      const { presignedUrl, cdnUrl } = await step1Res.json()

      // Step 2: Upload image bytes
      setStep(2)
      setStepLabel('Uploading image...')
      const putRes = await fetch(presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!putRes.ok) throw new Error('Failed to upload image')

      // Step 3: Register image URL
      setStep(3)
      setStepLabel('Registering image...')
      const step3Res = await fetch(`${API_BASE}/pipeline/upload-image-from-url`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
      })
      if (!step3Res.ok) {
        const errBody = await step3Res.text()
        throw new Error(`Failed to register image: ${errBody}`)
      }
      const { imageId } = await step3Res.json()

      // Step 4: Generate captions
      setStep(4)
      setStepLabel('Generating captions (this may take a moment)...')
      const step4Res = await fetch(`${API_BASE}/pipeline/generate-captions`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ imageId, ...(selectedFlavorId && { humorFlavorId: selectedFlavorId }) }),
      })
      if (!step4Res.ok) {
        const errBody = await step4Res.text()
        throw new Error(`Failed to generate captions: ${errBody}`)
      }
      const data = await step4Res.json()
      setCaptions(Array.isArray(data) ? data : data.captions || [])
      setUploadedImageUrl(cdnUrl)

      setStep(5)
      setStepLabel('Done!')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const stepIndicators = [
    'Get upload URL',
    'Upload image',
    'Register image',
    'Generate captions',
  ]

  return (
    <div>
      {/* File Input */}
      <div style={{
        border: '2px dashed #ddd',
        borderRadius: '8px',
        padding: '32px',
        textAlign: 'center',
        marginBottom: '20px',
        backgroundColor: '#fafafa',
      }}>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
          onChange={handleFileChange}
          style={{ marginBottom: '12px' }}
        />
        {previewUrl && (
          <div style={{ marginTop: '16px' }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: '400px',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
            />
          </div>
        )}
      </div>

      {/* Humor Flavor Selector */}
      {flavors.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#4a5568', fontWeight: 500 }}>
            Humor Style
          </label>
          <select
            value={selectedFlavorId || ''}
            onChange={e => setSelectedFlavorId(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '14px',
              width: '100%',
              maxWidth: '320px',
              backgroundColor: '#fff',
            }}
          >
            {flavors.map(f => (
              <option key={f.id} value={f.id}>
                {f.slug}{f.description ? ` — ${f.description}` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        style={{
          padding: '12px 24px',
          backgroundColor: !file || loading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: !file || loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
        }}
      >
        {loading ? 'Processing...' : 'Upload & Generate Captions'}
      </button>

      {/* Progress Steps */}
      {step > 0 && step <= 4 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '8px',
          }}>
            {stepIndicators.map((label, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: i + 1 <= step ? '#0070f3' : '#ddd',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </div>
          <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>
            Step {step}/4: {stepLabel}
          </p>
        </div>
      )}

      {/* Success Message */}
      {step === 5 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <p style={{ color: '#38a169', fontWeight: 'bold', margin: 0 }}>
            Captions generated successfully!
          </p>
          <Link href="/captions" style={{
            padding: '6px 14px',
            backgroundColor: '#0070f3',
            color: 'white',
            borderRadius: '6px',
            fontSize: '13px',
            textDecoration: 'none',
          }}>
            View All Captions
          </Link>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ color: '#e53e3e', marginBottom: '16px' }}>
          Error: {error}
        </p>
      )}

      {/* Generated Captions */}
      {captions.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '16px' }}>Generated Captions</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}>
            {captions.map((caption, i) => (
              <div
                key={caption.id || i}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                {uploadedImageUrl && (
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded"
                    style={{
                      width: '100%',
                      height: '220px',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <div style={{ padding: '12px' }}>
                  <p style={{ margin: 0, fontSize: '15px', color: '#333' }}>
                    {typeof caption === 'string' ? caption : caption.content || caption.text || JSON.stringify(caption)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
