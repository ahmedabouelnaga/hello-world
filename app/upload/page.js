import ImageUploader from './ImageUploader'

export default function UploadPage() {
  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 20px 0', fontSize: '28px', color: '#1a202c' }}>
        Upload & Generate Captions
      </h1>
      <ImageUploader />
    </div>
  )
}
