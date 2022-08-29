import { useState } from 'react'
import { ArrowRightCircleIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

import { sbClient } from '../utils/supabase'
import { LoaderScreen } from '../components/LoaderScreen'
import { classNames } from '../utils/ui-helpers'
import { createHash, md5Hash } from '../utils/string-helpers'
import { ExitButton } from '../components/ExitButton'
import { TitleBar } from '../components/TitleBar'
import { localData } from '../utils/storage'

export const AuthScreen = () => {
  const [loading, setLoading] = useState(false)
  const [actionIsLogin, setActionIsLogin] = useState(true)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [realname, setRealName] = useState('')

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setRealName('')
  }

  const handleLogin = async () => {
    const { user, error } = await sbClient.auth.signIn({ email, password })
    setLoading(false)

    if (error && !user) {
      return toast.error('You are not registered yet.')
    }

    if (error) return toast.error(error.message)

    if (user) {
      // If login success then store hashed passphrase in localStorage
      const hashedPassphrase = await md5Hash(password)
      await localData.set('passphrase', hashedPassphrase)
      setLoading(false)
    }

    return resetForm()
  }

  const handleRegister = async () => {
    const passphrase = await createHash(password)
    const { error } = await sbClient.auth.signUp({ email, password }, { data: { realname, passphrase } })

    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Check your email to verify your account!')
    setActionIsLogin(true)
    return resetForm()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    return actionIsLogin ? handleLogin() : handleRegister()
  }

  if (loading) return <LoaderScreen />

  return (
    <div className="z-20 pt-16">
      <TitleBar />
      <ExitButton />
      <div className={classNames(actionIsLogin ? 'py-12' : 'py-0', 'flex min-h-full items-center justify-center px-6')}>
        <div className="w-full max-w-sm">
          <div>
            <h2 className="mt-8 text-center text-xl font-semibold tracking-tight text-white">
              {actionIsLogin ? 'Sign in to continue' : 'Create account'}
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  defaultValue={email}
                />
              </div>
              {!actionIsLogin && (
                <div>
                  <label htmlFor="realname" className="sr-only">
                    First name
                  </label>
                  <input
                    id="realname"
                    name="realname"
                    type="text"
                    className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none"
                    placeholder="Full name"
                    onChange={(e) => setRealName(e.target.value)}
                    defaultValue={realname}
                    required
                  />
                </div>
              )}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none"
                  onChange={(e) => setPassword(e.target.value)}
                  defaultValue={password}
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 focus:ring-brand-500 group relative flex w-full justify-center rounded-md border border-transparent py-3 px-4 text-sm font-bold uppercase text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <span>Continue</span>
                <ArrowRightCircleIcon className="text-brand-100 group-hover:text-brand-200 ml-2 -mr-1 h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="absolute left-0 bottom-0 flex w-full flex-col items-center justify-center space-y-3 py-10">
            {/* <p className='text-center text-sm text-gray-300'>
                        Forgot password?{' '}
                        <a
                            href='https://otentik.app/recovery?ref=authenticator'
                            className='font-medium text-brand-500 hover:text-brand-600'
                            rel='noreferrer noopener'
                            target='_blank'
                        >
                            Reset
                        </a>
                    </p> */}
            <p className="text-center text-sm text-gray-300">
              {actionIsLogin ? "Dont' have account? " : 'Already have account? '}
              <button
                type="button"
                className="text-brand-500 hover:text-brand-600 font-medium"
                onClick={() => setActionIsLogin(!actionIsLogin)}
              >
                {actionIsLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
