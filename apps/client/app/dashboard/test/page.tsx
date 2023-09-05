import { Panel, PanelContent, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import CallToAction from '../(user)/CallToAction'
import NominationBox from '@/components/Combobox'
import { getAllUsers, getCurrentCycle, getFullReport, getUserById } from '@/lib/get-data-api'
import { cookies } from 'next/headers'


async function Page() {
  const cookieStore = cookies()
  const loggedUserId = cookieStore.get('userId').value
  const token = cookieStore.get('token')

  const cycle = await getCurrentCycle()
  const cycleId = cycle._id

  const user = await getUserById(loggedUserId)
  const users = await getAllUsers()
  const report = await getFullReport(loggedUserId)

  return (
    <div className='p-20 w-[900px]'>
      <Panel size='horizontal'>
        <PanelHeader variant='gray'>
          <PanelTitle>Test Panel</PanelTitle>
        </PanelHeader>
        <PanelContent className='p-5 py-7'>
          <CallToAction action='nominate' numberOfPeers={3} />
          <NominationBox users={users} loggedUserId={loggedUserId} report={report} cycleId={cycleId} />
        </PanelContent>
      </Panel>
    </div>
  )
}

export default Page