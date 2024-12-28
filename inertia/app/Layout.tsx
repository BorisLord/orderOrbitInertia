import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Layout
