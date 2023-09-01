'use client'
import React, { FunctionComponent, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

interface IMetricProps {
  question: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onClick: (n: number, name: string) => void
  name: string
  value: string
  rating: number
  maxRating: number
  placeholder?: string
}

const Metric: FunctionComponent<IMetricProps> = ({
  question,
  onChange,
  onClick,
  name,
  value,
  rating,
  maxRating,
  placeholder = 'Comments',
}) => {
  const [selectedKey, setSelectedKey] = useState(rating)

  return (
    <div className="flex flex-col gap-6 mb-4 justify-center items-center">
      <h4 className="flex gap-2 justify-center items-center">{question}</h4>
      <div className="flex gap-2 justify-center items-center">
        {createArrayNumbers(maxRating).map((n) => (
          <Button
            key={n}
            onClick={() => {
              onClick(n, name)
              setSelectedKey(n)
            }}
            size="sm"
            variant={n === selectedKey ? 'default' : 'secondary'}
          >
            {n}
          </Button>
        ))}
      </div>
      <div>
        <Textarea
          className="text-start w-96 h-28"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default Metric

function createArrayNumbers(maxNumber: number): number[] {
  return Array.from({ length: maxNumber }, (_, i) => i + 1)
}
