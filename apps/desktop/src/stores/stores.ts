import create from 'zustand'
import { persist } from 'zustand/middleware'
// import { localData } from '../utils/storage'

interface IStores {
  locked: boolean
  formCreateOpen: boolean
  forceFetch: boolean
  setLockStreenState: (status: boolean) => void
  setForceFetch: (status: boolean) => void
  setFormCreateOpen: (status: boolean) => void
}

export const useStores = create<IStores>()(
  persist(
    (set) => ({
      locked: true,
      formCreateOpen: false,
      forceFetch: false,
      setLockStreenState: (status) => set((state) => ({ locked: (state.locked = status) })),
      setForceFetch: (status) => set((state) => ({ forceFetch: (state.forceFetch = status) })),
      setFormCreateOpen: (status) =>
        set((state) => ({
          formCreateOpen: (state.formCreateOpen = status),
        })),
      getStorage: () => sessionStorage, // (optional) by default the 'localStorage' is used
      // getStorage: async (key: string) => {
      //     const value = await localData.get(key)
      //     return value || null
      // },
    }),

    {
      name: 'otentik-authenticator',
    }
  )
)
