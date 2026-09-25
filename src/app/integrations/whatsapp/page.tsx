import MessagingChannelTemplate from '@/components/MessagingChannelTemplate'
import { CHANNEL_PAGES } from '@/data/messagingChannels'
import { channelMetadata } from '@/data/messagingChannels/types'

const page = CHANNEL_PAGES['whatsapp']

export const metadata = channelMetadata(page)

export default function Page() {
  return <MessagingChannelTemplate page={page} />
}
