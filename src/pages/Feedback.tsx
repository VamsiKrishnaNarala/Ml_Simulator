import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { Panel, Eyebrow } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'

export default function Feedback() {
  const { user } = useAuth()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  // You can replace this with your actual Formspree endpoint
  const FORMSPREE_URL = 'https://formspree.io/f/xzeprjrp'

  const [errorMessage, setErrorMessage] = useState('Failed to submit feedback. Please try again.')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      rollNumber: formData.get('rollNumber'),
      message: formData.get('message')
    }
    
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        setStatus('success')
        e.currentTarget.reset()
      } else {
        const data = await response.json().catch(() => null)
        console.error('Formspree response error:', data)
        if (data && data.errors && data.errors.length > 0) {
          setErrorMessage(data.errors[0].message)
        } else if (data && data.error) {
          setErrorMessage(data.error)
        } else {
          setErrorMessage('Failed to submit feedback. Please try again. Have you activated the form in your email?')
        }
        setStatus('error')
      }
    } catch (err) {
      console.error('Network error:', err)
      setErrorMessage('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <Eyebrow>We want to hear from you</Eyebrow>
      <h1 className="mt-2 font-display text-3xl font-semibold text-paper">Feedback</h1>
      <p className="mt-2 text-graphite-500 mb-8">
        Found a bug? Have a suggestion? Let us know what you think about the ML Lab.
      </p>

      <Panel className="p-6 sm:p-8">
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold text-paper">Thank You!</h2>
            <p className="text-graphite-500 mt-2">Your feedback has been submitted successfully.</p>
            <button 
              onClick={() => setStatus('idle')} 
              className="btn-secondary mt-6"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-graphite-500">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-xl border border-graphite-600 bg-graphite-900/50 px-4 py-2.5 text-paper outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="rollNumber" className="mb-1.5 block text-sm font-medium text-graphite-500">
                Roll Number
              </label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                defaultValue={user || ''}
                readOnly
                className="w-full rounded-xl border border-graphite-600 bg-graphite-900/30 px-4 py-2.5 text-graphite-500 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-graphite-500">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full resize-y rounded-xl border border-graphite-600 bg-graphite-900/50 px-4 py-2.5 text-paper outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Write your feedback here..."
              ></textarea>
            </div>

            {status === 'error' && (
              <p className="text-sm text-rose">{errorMessage}</p>
            )}

            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="btn-primary w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed"
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
