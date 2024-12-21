import { Suspense } from 'react'
import ForgotPasswordForm from '@/components/ForgotPasswordForm'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function ForgotPasswordPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Suspense fallback={<LoadingSpinner />}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  )
}

