import { Suspense } from 'react'
import SignupForm from '@/components/SignupForm'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Suspense fallback={<LoadingSpinner />}>
        <SignupForm />
      </Suspense>
    </div>
  )
}

