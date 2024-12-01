"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Info } from 'lucide-react'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { contractAddresses } from '@/lib/contracts/contract'
import { bountyABI } from '@/lib/contracts/bountyABI'
import { formatEther, parseEther } from 'viem'
import { waitForTransactionReceipt } from '@wagmi/core'
import { decodeEventLog } from 'viem'
interface BountyCreationWidgetProps {
  initialTitle?: string;
  initialDescription?: string;

}

export function BountyCreationWidget({ initialTitle = '', initialDescription = '',  }: BountyCreationWidgetProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [reward, setReward] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [completedData, setCompletedData] = useState<{
    title: string;
    description: string;
    reward: string;
    chainId: number;
    bountyId: string;
  } | null>(null)

  const config = useConfig()
  const { chain } = useAccount()
  const { chains } = useConfig()
  const { writeContractAsync } = useWriteContract()

  useEffect(() => {
    if (!isCompleted) {
      setTitle(initialTitle)
      setDescription(initialDescription)
    }
  }, [initialTitle, initialDescription, isCompleted])

  const getRewardPlaceholder = () => {
    if (!chain) return 'Please connect wallet'
    return chain.id === 666666666 
      ? 'Enter reward amount in degen'
      : 'Enter reward amount in eth'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isCompleted) return
    
    setIsLoading(true)
    setError(null)

    try {
      if (!chain) {
        throw new Error('Please connect your wallet')
      }

      const supportedChain = chains.find(c => c.id === chain.id)
      if (!supportedChain) {
        throw new Error('Please switch to a supported chain (Arbitrum, Base, or Degen)')
      }

      const contracts = contractAddresses[chain.id]
      if (!contracts) {
        throw new Error('Contract not deployed on this chain')
      }

      const rewardAmount = parseEther(reward)

      const tx = await writeContractAsync({
        abi: bountyABI,
        address: contracts.mainContract as `0x${string}`,
        functionName: 'createSoloBounty',
        args: [title, description],
        value: rewardAmount
      })

      const receipt = await waitForTransactionReceipt(config, { hash: tx })
      
      const log = receipt.logs[0]
      const data = decodeEventLog({
        abi: bountyABI,
        data: log.data,
        topics: log.topics,
      })
      
      if (data.eventName === 'BountyCreated') {
        const bountyId = data.args.id.toString()
        
       

        const completedInfo = {
          title,
          description,
          reward: formatEther(rewardAmount),
          chainId: chain.id,
          bountyId
        }
        setCompletedData(completedInfo)
        

        
        setIsCompleted(true)
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto bg-[#7E8EF1] shadow-lg rounded-lg border border-white/10">
      <CardHeader className="bg-[#615EFC] rounded-t-lg border-b border-white/10">
        <CardTitle className="text-white text-lg font-medium">
          {isCompleted ? 'Bounty Created Successfully!' : 'Create a Bounty'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-6">
          {error && (
            <div className="text-red-200 bg-red-500/20 p-3 rounded-lg text-sm">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter bounty title"
              value={isCompleted ? completedData?.title : title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isCompleted}
              className={`border border-white/20 bg-white/10 text-white placeholder-white/50 ${isCompleted ? "opacity-75" : ""}`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the bounty"
              value={isCompleted ? completedData?.description : description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isCompleted}
              className={`min-h-[100px] border border-white/20 bg-white/10 text-white placeholder-white/50 ${isCompleted ? "opacity-75" : ""}`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reward" className="text-gray-700">
              Reward
            </Label>
            <Input
              id="reward"
              type="number"
              step="0.000000000000000001"
              min="0"
              placeholder={getRewardPlaceholder()}
              value={isCompleted ? completedData?.reward : reward}
              onChange={(e) => setReward(e.target.value)}
              required
              disabled={isCompleted}
              className={`border border-gray-300 rounded-md p-2 ${isCompleted ? "bg-gray-100" : "bg-white"} text-black`}
            />
            <div className="flex items-center gap-1 text-sm text-white/80">
              <Info className="w-4 h-4" />
              <span>A 2.5% fee is deducted from completed bounties</span>
            </div>
          </div>
          {isCompleted && completedData && (
            <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
              <p className="text-white">
                Bounty created successfully! View it here:{' '}
                <a 
                  href={`https://poidh.xyz/${
                    completedData.chainId === 666666666 
                      ? 'degen' 
                      : completedData.chainId === 42161
                        ? 'arbitrum'
                        : 'base'
                  }/bounty/${completedData.bountyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-white hover:text-white/80"
                >
                  View Bounty
                </a>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-white/10">
          {!isCompleted && (
            <Button 
              type="submit" 
              className="w-full bg-[#615EFC] hover:bg-[#615EFC]/90 text-white rounded-lg transition-colors border border-white/10" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Bounty'}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}