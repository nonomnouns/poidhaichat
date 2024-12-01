'use client'

import { useChat } from 'ai/react'
import ReactMarkdown from 'react-markdown'
import { BountyCreationWidget } from '@/components/createfrom'
import { ArrowUp } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Sidebar from '@/components/sidebar'

interface BountyToolResult {
  title: string
  description: string
}

export default function Home() {
  const chat = useChat()
  const { messages, input, handleInputChange, handleSubmit } = chat
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
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
    console.log('Messages updated:', messages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      toolInvocations: m.toolInvocations?.map(inv => ({
        toolName: inv.toolName,
        state: inv.state
      }))
    })))
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const maxHeight = window.innerHeight * 0.3
      const scrollHeight = textarea.scrollHeight
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  useEffect(() => {
    window.addEventListener('resize', adjustTextareaHeight)
    return () => window.removeEventListener('resize', adjustTextareaHeight)
  }, [])

  return (
    <main className="min-h-screen relative flex">
      <div 
        className="fixed-background"
      />
      
      <Sidebar />

     
      {!isMobile && (
        <div className="fixed top-6 left-72 z-10">
          <h1 className="text-4xl font-bold text-[#615EFC]">poidhAI</h1>
        </div>
      )}
      
      <div className={`flex-1 ${!isMobile ? 'ml-64' : 'ml-0'}`}>
        <div className="container max-w-4xl mx-auto pt-20 pb-32 px-6">
          <div className="flex flex-col space-y-8">
            {messages.map(m => {
              const bountyToolInvocation = m.toolInvocations?.find(
                inv => inv.state === 'result' && inv.toolName === 'createBountyTool'
              )

              return (
                <div key={m.id} className="px-6">
                  {m.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="bg-[#615EFC] text-white rounded-2xl px-6 py-4 max-w-[90%] md:max-w-[80%] text-lg shadow-lg">
                        <ReactMarkdown
                          className="prose prose-invert max-w-none prose-lg"
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div className="pl-0 md:pl-6 max-w-[90%] md:max-w-[80%] text-lg">
                      <ReactMarkdown
                        className="prose prose-slate max-w-none prose-lg"
                      >
                        {m.content}
                      </ReactMarkdown>

                      {bountyToolInvocation && (
                        <div className="mt-6">
                          <BountyCreationWidget
                            initialTitle={(
                              bountyToolInvocation as { result: BountyToolResult }
                            ).result.title}
                            initialDescription={(
                              bountyToolInvocation as { result: BountyToolResult }
                            ).result.description}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className={`fixed bottom-8 ${!isMobile ? 'left-64' : 'left-0'} right-0 px-6`}>
          <div className={`container mx-auto ${!isMobile ? 'max-w-4xl' : 'max-w-3xl'}`}>
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex flex-col w-full border border-black/10 dark:border-gray-800/50 bg-white dark:bg-gray-700 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  placeholder="Message poidhAI..."
                  onChange={handleInputChange}
                  className={`resize-none w-full max-h-[200px] ${!isMobile ? 'min-h-[72px]' : 'min-h-[52px]'} py-3 pl-4 pr-14 bg-transparent focus:outline-none dark:bg-transparent dark:text-white text-black/90 text-base md:text-lg rounded-xl`}
                  style={{
                    maxHeight: '30vh'
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <Button 
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className={`absolute bottom-2.5 right-2.5 ${!isMobile ? 'h-10 w-10' : 'h-8 w-8'} bg-[#615EFC] hover:bg-[#615EFC]/90 rounded-lg transition-colors duration-200`}
                >
                  <ArrowUp className={`${!isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-white`} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .scrollbar-none {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}