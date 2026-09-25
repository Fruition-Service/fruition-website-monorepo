import type { ChannelPage } from './types'
import { WHATSAPP } from './whatsapp'
import { LINE } from './line'
import { VIBER } from './viber'

export type ChannelKey = 'whatsapp' | 'line' | 'viber'

export const CHANNEL_PAGES: Record<ChannelKey, ChannelPage> = {
  whatsapp: WHATSAPP,
  line: LINE,
  viber: VIBER,
}
