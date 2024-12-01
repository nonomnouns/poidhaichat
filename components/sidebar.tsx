'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { WalletIcon, PlusCircle, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)


  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
   
    checkIsMobile()
    
  
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar')
      if (isMobile && isOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile, isOpen])

  return (
    <>
    
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#615EFC] text-white md:hidden"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}


      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" />
      )}

    
      <aside
        id="sidebar"
        className={`fixed left-0 top-0 h-full w-64 bg-[#7E8EF1] border-r border-gray-200 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-white/10">
          <button
            onClick={() => {}} // Add your new chat handler here
            className="w-full flex items-center justify-center gap-2 bg-[#615EFC] hover:bg-[#615EFC]/90 text-white rounded-lg px-4 py-2 font-medium transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            New Chat
          </button>
        </div>

        <div className="flex-1">
          {/* Add other sidebar content here if needed */}
        </div>

        <div className="p-4 border-t border-white/10">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="w-full flex items-center justify-center gap-2 bg-[#615EFC] hover:bg-[#615EFC]/90 text-white rounded-lg px-4 py-2 font-medium transition-colors"
                        >
                          <WalletIcon className="w-5 h-5" />
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 font-medium transition-colors"
                        >
                          Wrong Network
                        </button>
                      );
                    }

                    return (
                      <div className="flex flex-col gap-2 w-full">
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 font-medium transition-colors"
                        >
                          {chain.hasIcon && (
                            <div
                              className="w-4 h-4 rounded-full overflow-hidden"
                              style={{ background: chain.iconBackground }}
                            >
                              {chain.iconUrl && (
                                <Image
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  width={28}
                                  height={28}
                                  className="w-4 h-4"
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </button>

                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="w-full flex items-center justify-center gap-2 bg-[#615EFC] hover:bg-[#615EFC]/90 text-white rounded-lg px-4 py-2 font-medium transition-colors truncate"
                        >
                          {account.displayName}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </aside>
    </>
  )
}