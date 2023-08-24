'use client'

import { Button } from '@/components/ui/button'
import Metric from '@/components/ui/metric'
import { updateReport } from '@/lib/fetch'
import { GradeData, ReportData } from '@/types/models'
import { useState } from 'react'


const mutation = `mutation updateReport($targetId:String!, $cycleId:String!, $input:ReportInput!) {
  updateReport(targetId:$targetId, cycleId:$cycleId, input:$input){
    remarks
    reviews {
      peer {
        submitted
        reviewer
        grades {
          metric
          rating
          maxRating
          comment
        }
      }
    }
  }
}

`


export default function MetricList({
  report,
  target
}: {
  report: ReportData,
  target: string
}) {
  const targetId = report._id.target
  const review = report.reviews.peer[0]
  const { submitted, grades: gradeData, reviewer } = review
  const [state, setState] = useState(gradeData)
  const [isSubmitted, setIsSubmitted] = useState(submitted)

  const mutationVars = {
    targetId: targetId,
    cycleId: '131313',
    input: report
  }

  const handleRatingClick = (n: number, name: string) => {
    console.log('number from handleclick', n, name)
    const updatedState = [...state]
    const gradeIndex = updatedState.findIndex(obj => obj.metric === name)
    const grade = updatedState[gradeIndex]
    grade.rating = n
    setState(updatedState)

  }
  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedState = [...state]
    const gradeIndex = updatedState.findIndex(obj => obj.metric === event.target.name)
    const grade = updatedState[gradeIndex]
    grade.comment = event.target.value
    setState(updatedState)

  }
  const handleSubmit = () => {
    mutationVars.input.reviews.peer[0].grades = state
    mutationVars.input.reviews.peer[0].submitted = true
    updateReport(mutation, mutationVars)
    setIsSubmitted(true)
  }

  const handleSaveDraft = () => {
    mutationVars.input.reviews.peer[0].grades = state
    updateReport(mutation, mutationVars)
  }

  return (
    <div className={`w-1/2 border-2 p-4`}>
      {state.map((datum) => {
        return (
          <Metric
            key={datum.metric}
            question={`How did ${target} do on ${datum.metric}?`}
            name={datum.metric}
            value={datum.comment}
            maxRating={datum.maxRating}
            onChange={handleCommentChange}
            onClick={handleRatingClick}
          />
        )
      })}
      <div className="gap-6 flex justify-center">
        <Button disabled={isSubmitted} className="w-36" onClick={handleSaveDraft} size="lg">
          Save Draft
        </Button>
        <Button className="w-36" onClick={handleSubmit} size="lg">
          Submit
        </Button>
      </div>
    </div>
  )
}
