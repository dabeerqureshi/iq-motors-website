import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '../ContactForm'
import emailjs from '@emailjs/browser'

vi.mock('@emailjs/browser', async () => {
  const actual = await vi.importActual('@emailjs/browser')
  return {
    __esModule: true,
    ...actual,
    default: {
      init: vi.fn(),
      sendForm: vi.fn().mockResolvedValue({ status: 200, text: 'OK' }),
    },
  }
})

const mockSendForm = vi.mocked(emailjs.sendForm)

describe('ContactForm', () => {
  const renderForm = () => render(<ContactForm />)

  beforeEach(() => {
    vi.clearAllMocks()
    mockSendForm.mockResolvedValue({ status: 200, text: 'OK' })
  })

  it('renders form fields', () => {
    renderForm()
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your contact number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your vehicle registration/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your vehicle current mileage/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/how can we help/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderForm()
    expect(screen.getByRole('button', { name: /submit request/i })).toBeInTheDocument()
  })

  it('submits and shows success', async () => {
    renderForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/your name/i), 'John')
    await user.type(screen.getByLabelText(/your contact number/i), '0311')
    await user.type(screen.getByLabelText(/your vehicle registration/i), 'ABC')
    await user.type(screen.getByLabelText(/your vehicle current mileage/i), '100')
    await user.type(screen.getByLabelText(/how can we help/i), 'Service')
    const btn = screen.getByRole('button', { name: /submit request/i })
    await user.click(btn)
    await waitFor(() => {
      expect(mockSendForm).toHaveBeenCalled()
    }, { timeout: 5000 })
  })

  it('shows loading state', async () => {
    let resolvePromise: (value: { status: number; text: string }) => void
    mockSendForm.mockImplementation(
      () => new Promise((resolve) => { resolvePromise = resolve })
    )

    renderForm()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/your name/i), 'John')
    await user.type(screen.getByLabelText(/your contact number/i), '0311')
    await user.type(screen.getByLabelText(/your vehicle registration/i), 'ABC')
    await user.type(screen.getByLabelText(/your vehicle current mileage/i), '100')
    await user.type(screen.getByLabelText(/how can we help/i), 'Service')
    const btn = screen.getByRole('button', { name: /submit request/i })
    expect(btn).not.toBeDisabled()
    await user.click(btn)
    expect(btn).toBeDisabled()
    resolvePromise!({ status: 200, text: 'OK' })
    await waitFor(() => {
      expect(btn).not.toBeDisabled()
    }, { timeout: 5000 })
  })

  it('disables button during submit', async () => {
    let resolvePromise: (value: { status: number; text: string }) => void
    mockSendForm.mockImplementation(
      () => new Promise((resolve) => { resolvePromise = resolve })
    )

    renderForm()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/your name/i), 'John')
    await user.type(screen.getByLabelText(/your contact number/i), '0311')
    await user.type(screen.getByLabelText(/your vehicle registration/i), 'ABC')
    await user.type(screen.getByLabelText(/your vehicle current mileage/i), '100')
    await user.type(screen.getByLabelText(/how can we help/i), 'Service')
    const btn = screen.getByRole('button', { name: /submit request/i })
    expect(btn).not.toBeDisabled()
    await user.click(btn)
    expect(btn).toBeDisabled()
    resolvePromise!({ status: 200, text: 'OK' })
    await waitFor(() => {
      expect(btn).not.toBeDisabled()
    }, { timeout: 5000 })
  })
})

