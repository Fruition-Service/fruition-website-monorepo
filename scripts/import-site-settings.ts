import { writeClient } from './sanity-client.js'

async function main() {
  const doc = {
    _type: 'siteSettings',
    _id: 'siteSettings',
    phone: '+61 483 955 931',
    calendlyLink: 'https://calendly.com/global-calendar-fruitionservices',
    mondayAffiliateLink: 'https://monday.com/crm?utm_source=Partner&utm_campaign=fruitionanz',
    footerText: 'Fruition is a Platinum monday.com Partner with 900+ implementations globally.',
  }

  await writeClient.createOrReplace(doc)
  console.log('Created siteSettings')
}

main().catch(console.error)
