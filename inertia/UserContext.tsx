import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import type { User } from '#models/user'

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null)

  // Fonction pour mettre à jour l'utilisateur et sauvegarder dans le Local Storage
  const setUser = (user: User | null) => {
    setUserState(user)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)) // Sauvegarde des données
    } else {
      localStorage.removeItem('user') // Supprime les données si null
    }
  }

  // Charger les données utilisateur depuis le Local Storage au montage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUserState(JSON.parse(storedUser))
    }
  }, [])

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
