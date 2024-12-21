import { Suspense } from 'react'
import LoginForm from "@/components/Auth/Login/LoginForm"
import LoadingSpinner from '../../Loading'

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Suspense fallback={<LoadingSpinner />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

