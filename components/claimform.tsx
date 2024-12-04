"use client"

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { contractAddresses } from '@/lib/contracts/contract'
import { bountyABI } from '@/lib/contracts/bountyABI'
import { waitForTransactionReceipt } from '@wagmi/core'

interface ClaimFormProps {
  bountyId: string
  bountyData?: {
    issuer: string
    name: string
    description: string
  }
  initialTitle?: string
  initialDescription?: string
}

export function ClaimForm({ bountyId, bountyData, initialTitle = '', initialDescription = '' }: ClaimFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [proofUrl, setProofUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [viewUrl, setViewUrl] = useState<string | null>(null)

  const config = useConfig()
  const { address } = useAccount()
  const { chain } = useAccount()
  const { writeContractAsync } = useWriteContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isCompleted || !address || !proofUrl.trim()) return
    
    setIsLoading(true)
    setError(null)

    try {
      if (!chain) {
        throw new Error('Please connect your wallet')
      }

      const contracts = contractAddresses[chain.id]
      if (!contracts) {
        throw new Error('Contract not deployed on this chain')
      }

      const tx = await writeContractAsync({
        abi: bountyABI,
        address: contracts.mainContract as `0x${string}`,
        functionName: 'createClaim',
        args: [BigInt(bountyId), title, proofUrl, description]
      })

     
      await waitForTransactionReceipt(config, { hash: tx })
      
      const chainUrlName = getChainUrlName(chain.name)
      const bountyUrl = `https://poidh.xyz/${chainUrlName}/bounty/${bountyId}`
      setViewUrl(bountyUrl)
      
      setIsCompleted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit claim')
    } finally {
      setIsLoading(false)
    }
  }

  const getChainUrlName = (chainName: string): string => {
    const chainMap: { [key: string]: string } = {
      'Arbitrum One': 'arbitrum',
      'Base': 'base',
      'Degen': 'degen'
    }
    return chainMap[chainName] || chainName.toLowerCase()
  }

  if (isCompleted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Claim Submitted Successfully! 🎉</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your claim has been submitted successfully.</p>
          {viewUrl && (
            <div className="mt-4">
              <p>View your claim at:</p>
              <a 
                href={viewUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline break-all"
              >
                {viewUrl}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (!address) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please connect your wallet to submit a claim</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submit Claim for Bounty #{bountyId}</CardTitle>
        {bountyData && (
          <div className="text-sm text-muted-foreground mt-2">
            <p>Bounty: {bountyData.name}</p>
            <p>Issuer: {bountyData.issuer}</p>
          </div>
        )}
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your claim title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe how you completed the bounty"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proofUrl">Proof URL (Image/Screenshot)</Label>
            <Input
              id="proofUrl"
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="Enter image URL (e.g. from Imgur)"
              required
            />
            <p className="text-xs text-muted-foreground">Upload your proof image to Imgur or similar service and paste the URL here</p>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
        </CardContent>

        <CardFooter>
          <Button 
            type="submit" 
            disabled={isLoading || !proofUrl.trim()}
            className="w-full"
          >
            {isLoading ? 'Submitting...' : 'Submit Claim'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}