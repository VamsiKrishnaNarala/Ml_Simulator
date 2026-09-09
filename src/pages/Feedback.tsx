import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { Panel, Eyebrow } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'

export default function Feedback() {
  const { user } = useAuth()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  // You can replace this with your actual Formspree endpoint
  const FORMSPREE_URL = 'https://formspree.io/f/xzeprjrp'

  const handleSubmit = () => {
    // We don't prevent default! We let the browser submit the form natively to the hidden iframe.
    setStatus('submitting')
    
    // Assume success after a short delay to allow the iframe to load the result
    setTimeout(() => {
      setStatus('success')
    }, 800)
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <Eyebrow>We want to hear from you</Eyebrow>
      <h1 className="mt-2 font-display text-3xl font-semibold text-brand">Feedback</h1>
      <p className="mt-2 text-muted mb-8">
        Found a bug? Have a suggestion? Let us know what you think about the ML Lab.
      </p>

      {/* Hidden iframe to intercept the form redirect */}
      <iframe name="hidden_iframe" id="hidden_iframe" style={{ display: 'none' }}></iframe>

      <Panel className="p-6 sm:p-8">
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-brand mb-4" />
            <h2 className="text-xl font-semibold text-brand">Thank You!</h2>
            <p className="text-muted mt-2">Your feedback has been submitted successfully.</p>
            <button 
              onClick={() => setStatus('idle')} 
              className="btn-secondary mt-6"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form 
            action={FORMSPREE_URL} 
            method="POST" 
            target="hidden_iframe"
            onSubmit={handleSubmit} 
            className="space-y-5"
          >
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-muted">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-xl border border-default bg-background/50 px-4 py-2.5 text-brand outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="rollNumber" className="mb-1.5 block text-sm font-medium text-muted">
                Roll Number
              </label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                defaultValue={user || ''}
                readOnly
                className="w-full rounded-xl border border-default bg-background/30 px-4 py-2.5 text-muted outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-muted">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full resize-y rounded-xl border border-default bg-background/50 px-4 py-2.5 text-brand outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Write your feedback here..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="btn-primary w-full justify-center transition hover:bg-primary-bright disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send Feedback
                </>
              )}
            </button>
          </form>
        )}
      </Panel>
    </div>
  )
}
