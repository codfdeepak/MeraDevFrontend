import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  resetConsultationState,
  selectConsultationSubmitError,
  selectConsultationSubmitStatus,
  selectLastConsultation,
} from '../Redux/slices/consultationSlice'
import { submitConsultationRequest } from '../Redux/thunks/consultationThunks'

const emptyForm = {
  name: '',
  mobile: '',
  city: '',
  serviceName: '',
  topic: '',
}

function ConsultationModal({ onClose, defaultServiceName = '' }) {
  const dispatch = useDispatch()
  const submitStatus = useSelector(selectConsultationSubmitStatus)
  const submitError = useSelector(selectConsultationSubmitError)
  const lastSubmitted = useSelector(selectLastConsultation)

  const [form, setForm] = useState(() => ({
    ...emptyForm,
    serviceName: defaultServiceName || '',
  }))

  useEffect(() => {
    dispatch(resetConsultationState())
  }, [dispatch])

  const isSubmitting = submitStatus === 'loading'
  const isSuccess = submitStatus === 'succeeded'

  const submittedAtLabel = useMemo(() => {
    const value = lastSubmitted?.bookedAt || lastSubmitted?.createdAt
    if (!value) return ''
    return new Date(value).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }, [lastSubmitted])

  const handleSubmit = async (event) => {
    event.preventDefault()
    await dispatch(
      submitConsultationRequest({
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        city: form.city.trim(),
        serviceName: form.serviceName.trim(),
        topic: form.topic.trim(),
        sourcePage: 'services',
      }),
    )
  }

  return (
    <div className="consultation-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="consultation-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Free consultation form"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="consultation-modal-head">
          <h3>Book Free Consultation</h3>
          <button className="consultation-close-btn" type="button" onClick={onClose} aria-label="Close form">
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div className="consultation-success">
            <p>Your request has been submitted successfully.</p>
            <small>We will contact you within 24 hours.</small>
            {submittedAtLabel && <small>Booked at: {submittedAtLabel}</small>}
            <button className="cta primary cta-btn" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form className="consultation-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Your name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Enter your name"
                required
              />
            </label>

            <label className="field">
              <span>Mobile number</span>
              <input
                value={form.mobile}
                onChange={(event) => setForm((prev) => ({ ...prev, mobile: event.target.value }))}
                placeholder="+91 98765 43210"
                required
              />
            </label>

            <label className="field">
              <span>Your city</span>
              <input
                value={form.city}
                onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                placeholder="Enter your city"
                required
              />
            </label>

            <label className="field">
              <span>Service name (optional)</span>
              <input
                value={form.serviceName}
                onChange={(event) => setForm((prev) => ({ ...prev, serviceName: event.target.value }))}
                placeholder="E-Commerce Website"
              />
            </label>

            <label className="field">
              <span>Your topic or doubts</span>
              <textarea
                rows={4}
                value={form.topic}
                onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
                placeholder="Write what you want to discuss"
                required
              />
            </label>

            {submitError && <p className="error">{submitError}</p>}

            <button className="cta primary cta-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ConsultationModal
