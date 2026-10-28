/**
 * Migrate site-wide chrome (navigation, footer, badges, carousel logos) to
 * the `siteSettings` singleton. Preserves existing `phone`, `calendlyLink`,
 * and `mondayAffiliateLink` if they are already set.
 *
 * Run with:
 *   npx tsx scripts/sanity-migrate/site-settings.ts
 */
import { writeClient, uploadLocalImage, withKeys } from './lib'

const CALENDLY_URL = 'https://calendly.com/global-calendar-fruitionservices'
const PHONE_AU = '+61 483 955 931'

async function main() {
  console.log('— Uploading site-settings images…')

  // ---------- Logos ----------
  const logo = await uploadLocalImage('/images/logo-fruition.png')
  const logoWhite = await uploadLocalImage('/images/logo-fruition.png')
  const logoRound = await uploadLocalImage('/images/logo-fruition-round.png')

  // ---------- Navbar partner badges ----------
  const navPlatinum = await uploadLocalImage('/images/partner-platinum.png')
  const navAdvanced = await uploadLocalImage('/images/partner-advanced-delivery.png')
  const navMake = await uploadLocalImage('/images/partner-make.png')

  // ---------- Footer partner logos ----------
  const footerPlatinumSm = await uploadLocalImage('/images/partner-platinum-sm.png')
  const footerGoldSolution = await uploadLocalImage('/images/partner-gold-solution.png')
  const footerAdvancedSm = await uploadLocalImage('/images/partner-advanced-delivery-sm.png')
  const footerN8n = await uploadLocalImage('/images/partner-n8n.png')
  const footerMakeSm = await uploadLocalImage('/images/partner-make-sm.png')
  const footerAircall = await uploadLocalImage('/images/partner-aircall.png')
  const footerHootsuite = await uploadLocalImage('/images/partner-hootsuite.png')
  const footerGuidde = await uploadLocalImage('/images/partner-guidde.png')

  // ---------- Social icons ----------
  const socialFacebook = await uploadLocalImage('/images/social-facebook.png')
  const socialLinkedin = await uploadLocalImage('/images/social-linkedin.png')
  const socialWhatsapp = await uploadLocalImage('/images/social-whatsapp.png')
  const socialYoutube = await uploadLocalImage('/images/social-youtube.png')

  // ---------- Shared badges ----------
  const badgeCertifications = await uploadLocalImage('/images/badge-certifications.png')
  const badgeSecurity = await uploadLocalImage('/images/badge-security.png')
  const badgeForrester = await uploadLocalImage('/images/badge-forrester.png')
  const badgeMondayPartners = await uploadLocalImage('/images/badge-monday-partners.png')

  // ---------- Carousel logos ----------
  const carouselRefs: { alt: string; image: Awaited<ReturnType<typeof uploadLocalImage>> }[] = []
  for (let i = 1; i <= 11; i++) {
    const image = await uploadLocalImage(`/images/carousel-logo-${i}.png`)
    carouselRefs.push({ alt: `Client ${i}`, image })
  }

  // ---------- Fetch existing singleton (preserve optional fields) ----------
  const existing = await writeClient.fetch<{
    _id?: string
    phone?: string
    calendlyLink?: string
    mondayAffiliateLink?: string
    footerText?: string
  } | null>('*[_type == "siteSettings"][0]{_id, phone, calendlyLink, mondayAffiliateLink, footerText}')

  // ---------- Navigation ----------
  const navigationRaw = [
    {
      _type: 'navItem',
      label: 'What We Offer',
      sections: [
        {
          _type: 'navSection',
          heading: 'Services',
          items: [
            { _type: 'navLink', label: 'Implementation Packages', href: '/implementation-packages' },
            { _type: 'navLink', label: 'monday.com Training', href: '/monday-training' },
            { _type: 'navLink', label: 'monday.com Implementation Consultants', href: '/monday-implementation-consultants' },
            { _type: 'navLink', label: 'monday CRM Consulting', href: '/monday-crm-consulting' },
          ],
        },
        {
          _type: 'navSection',
          heading: 'Solutions',
          items: [
            { _type: 'navLink', label: 'monday.com Project Management', href: '/monday-consulting-solutions/monday-project-management' },
            { _type: 'navLink', label: 'monday.com Service', href: '/monday-consulting-solutions/monday-service' },
            { _type: 'navLink', label: 'monday.com Finance', href: '/monday-consulting-solutions/monday-for-finance' },
            { _type: 'navLink', label: 'monday.com for Product Management', href: '/monday-consulting-solutions/monday-product-management' },
            { _type: 'navLink', label: 'monday.com HR Solutions', href: '/monday-consulting-solutions/monday-for-hr' },
            { _type: 'navLink', label: 'Solar CRM & Work Management Solution', href: '/monday-consulting-solutions/solar-crm-solution' },
            { _type: 'navLink', label: 'monday.com for Installation & Renovation', href: '/monday-consulting-solutions/monday-for-cabinetry-renovation' },
            { _type: 'navLink', label: 'AI Strategy & Execution', href: '/ai-strategy-and-execution' },
            { _type: 'navLink', label: 'AI Capability Assessment', href: '/ai-capability-assessment', icon: 'chart', description: '4-week AI readiness diagnostic & costed roadmap' },
          ],
        },
      ],
    },
    {
      _type: 'navItem',
      label: 'Partnerships & Locations',
      sections: [
        {
          _type: 'navSection',
          heading: 'Partnerships',
          items: [
            { _type: 'navLink', label: 'Anthropic Claude Partner', href: '/partnerships/anthropic-claude-partner', icon: 'anthropic', description: 'Enterprise Claude deployments & Claude Code' },
            { _type: 'navLink', label: 'OpenAI ChatGPT Partner', href: '/partnerships/openai-chatgpt-partner', icon: 'openai', description: 'ChatGPT Enterprise, custom GPTs & Assistants API' },
            { _type: 'navLink', label: 'Openclaw Partner', href: '/partnerships/openclaw-partner', icon: 'openclaw', description: 'Autonomous AI agents & multi-agent orchestration' },
            { _type: 'navLink', label: 'AWS Partner', href: '/partnerships/aws-partner', icon: 'layers', description: 'Bedrock, SageMaker, migration & FinOps' },
            { _type: 'navLink', label: 'Google Cloud Partner', href: '/partnerships/google-cloud-partner', icon: 'globe', description: 'BigQuery, GKE, Vertex AI & landing zones' },
            { _type: 'navLink', label: 'Google Gemini & Vertex AI Partner', href: '/partnerships/google-gemini-vertex-ai-partner', icon: 'sparkle', description: 'Gemini for Workspace & Vertex AI agents' },
            { _type: 'navLink', label: 'Microsoft Copilot Partner', href: '/partnerships/microsoft-copilot-partner', icon: 'zap', description: 'M365 Copilot rollout & Copilot Studio agents' },
            { _type: 'navLink', label: 'monday.com Expert Consultants', href: '/partnerships/monday-consulting-partner' },
            { _type: 'navLink', label: 'Certified Make Partner', href: '/partnerships/make-partners' },
            { _type: 'navLink', label: 'Certified n8n Partner', href: '/partnerships/n8n-integration-partner' },
            { _type: 'navLink', label: 'Certified ClickUp Partner', href: '/partnerships/certified-clickup-partner' },
            { _type: 'navLink', label: 'Certified Guidde Partner', href: '/partnerships/certified-guidde-partner' },
            { _type: 'navLink', label: 'Certified HubSpot Partner', href: '/partnerships/certified-hubspot-partner' },
            { _type: 'navLink', label: 'Hootsuite Delivery Partner', href: '/partnerships/hootsuite-delivery-partner' },
            { _type: 'navLink', label: 'Certified Aircall Partner', href: '/partnerships/aircall-partner' },
            { _type: 'navLink', label: 'Certified Atlassian Partner', href: '/partnerships/certified-atlassian-partner' },
          ],
        },
        {
          _type: 'navSection',
          heading: 'Locations',
          items: [
            { _type: 'navLink', label: 'monday.com Partner Australia', href: '/monday-partner-australia' },
            { _type: 'navLink', label: 'monday.com Partner UK', href: '/monday-partner-uk' },
            { _type: 'navLink', label: 'monday.com Partner US', href: '/monday-partner-us' },
            { _type: 'navLink', label: 'monday.com Partner Singapore', href: '/monday-partner-singapore' },
            { _type: 'navLink', label: 'monday.com Partner India', href: '/monday-partner-india' },
          ],
        },
      ],
    },
    {
      _type: 'navItem',
      label: 'Industries',
      sections: [
        {
          _type: 'navSection',
          heading: 'Industries',
          items: [
            { _type: 'navLink', label: 'monday.com for Construction', href: '/monday-for-construction' },
            { _type: 'navLink', label: 'monday.com for Manufacturing', href: '/monday-for-manufacturing' },
            { _type: 'navLink', label: 'monday.com for Retail', href: '/monday-for-retail' },
            { _type: 'navLink', label: 'monday.com for Professional Services', href: '/monday-for-professional-services' },
            { _type: 'navLink', label: 'monday.com for Government', href: '/monday-for-government' },
            { _type: 'navLink', label: 'monday.com for Marketing & Creative', href: '/monday-for-marketing' },
            { _type: 'navLink', label: 'monday.com for Real Estate', href: '/monday-for-real-estate' },
          ],
        },
      ],
    },
    {
      _type: 'navItem',
      label: 'About',
      sections: [
        {
          _type: 'navSection',
          heading: 'About',
          items: [
            { _type: 'navLink', label: 'About Us', href: '/about-us' },
            { _type: 'navLink', label: 'Careers', href: '/careers' },
            { _type: 'navLink', label: 'Meet The Team', href: '/fruition-team' },
            { _type: 'navLink', label: 'FAQs', href: '/faqs' },
            { _type: 'navLink', label: 'Case Studies', href: '/customer-testimonials#case-studies' },
            { _type: 'navLink', label: 'Blog', href: '/consulting-blog' },
          ],
        },
      ],
    },
  ]

  // Nested arrays need _keys at every level.
  const navigation = withKeys(
    navigationRaw.map((item) => ({
      ...item,
      sections: withKeys(
        item.sections.map((section) => ({
          ...section,
          items: withKeys(section.items),
        }))
      ),
    }))
  )

  // ---------- Navbar partner badges ----------
  const navbarPartnerBadges = withKeys([
    { _type: 'partnerBadge', name: 'monday.com Platinum Partner', image: navPlatinum, width: 80, height: 32 },
    { _type: 'partnerBadge', name: 'Advanced Delivery Partner', image: navAdvanced, width: 80, height: 32 },
    { _type: 'partnerBadge', name: 'Make Partners', image: navMake, width: 60, height: 32 },
  ])

  // ---------- Footer partner logos ----------
  const footerPartnerLogos = withKeys([
    { _type: 'footerPartnerLogo', name: 'monday.com Platinum Partner', image: footerPlatinumSm, width: 110, height: 38 },
    { _type: 'footerPartnerLogo', name: 'Gold Solution Partner', image: footerGoldSolution, width: 120, height: 41 },
    { _type: 'footerPartnerLogo', name: 'Advanced Delivery Partner', image: footerAdvancedSm, width: 110, height: 38 },
    { _type: 'footerPartnerLogo', name: 'n8n Partner', image: footerN8n, width: 104, height: 29 },
    { _type: 'footerPartnerLogo', name: 'Make Partners', image: footerMakeSm, width: 110, height: 26 },
    { _type: 'footerPartnerLogo', name: 'Aircall Partners', image: footerAircall, width: 89, height: 38 },
    { _type: 'footerPartnerLogo', name: 'Hootsuite Partners', image: footerHootsuite, width: 126, height: 28 },
    { _type: 'footerPartnerLogo', name: 'Guidde Partner', image: footerGuidde, width: 79, height: 28 },
  ])

  // ---------- Social links ----------
  const socialLinks = withKeys([
    { _type: 'socialLink', label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100092289551680', icon: socialFacebook },
    { _type: 'socialLink', label: 'LinkedIn', href: 'https://www.linkedin.com/company/fruition-services', icon: socialLinkedin },
    { _type: 'socialLink', label: 'WhatsApp', href: 'https://wa.me/61483955931', icon: socialWhatsapp },
    { _type: 'socialLink', label: 'YouTube', href: 'https://www.youtube.com/channel/UCF8mr3qiFVwiX0xrcAaKxgA', icon: socialYoutube },
  ])

  // ---------- Offices ----------
  const offices = withKeys([
    {
      _type: 'office',
      flag: '\u{1F1E6}\u{1F1FA}',
      city: 'Sydney, Australia',
      label: 'Head Office',
      href: '/monday-partner-australia',
      address: '64 York Street, Sydney NSW 2000 Australia',
      addressUrl: 'https://maps.app.goo.gl/1tHxQSq7Db3Xq4Rk7',
      phone: '+61 483 955 931',
      phoneTel: '+61483955931',
    },
    {
      _type: 'office',
      flag: '\u{1F1FA}\u{1F1F8}',
      city: 'New York, US Office',
      label: 'North America Office',
      href: '/monday-partner-us',
      address: '205 W 37th St, New York, NY 10018, United States',
      addressUrl: 'https://maps.app.goo.gl/4u1KjFHfUgiXGGta9',
      phone: '+1 302 330 2496',
      phoneTel: '+13023302496',
    },
    {
      _type: 'office',
      flag: '\u{1F1EC}\u{1F1E7}',
      city: 'London, UK',
      label: 'EMEA Office',
      href: '/monday-partner-uk',
      address: 'Medius House, 2 Sheraton St, London W1F 8BH, United Kingdom',
      addressUrl: 'https://maps.app.goo.gl/H8gDDCChm9Q5uMDm8',
      phone: '+44 7822 019548',
      phoneTel: '+447822019548',
    },
    {
      _type: 'office',
      flag: '\u{1F1F8}\u{1F1EC}',
      city: 'Singapore',
      label: 'APAC Office',
      href: '#',
      address: 'Address coming soon, Singapore',
      addressUrl: '',
      phone: '+65 0000 0000',
      phoneTel: '+6500000000',
    },
    {
      _type: 'office',
      flag: '\u{1F1EE}\u{1F1F3}',
      city: 'India',
      label: 'India Office',
      href: '#',
      address: 'Address coming soon, India',
      addressUrl: '',
      phone: '+91 00000 00000',
      phoneTel: '+910000000000',
    },
    {
      _type: 'office',
      flag: '\u{1F1F5}\u{1F1ED}',
      city: 'Philippines',
      label: 'Philippines Office',
      href: '#',
      address: 'Address coming soon, Philippines',
      addressUrl: '',
      phone: '+63 947 230 4274',
      phoneTel: '+639472304274',
    },
  ])

  // ---------- Footer column links ----------
  const footerServicesLinks = withKeys([
    { _type: 'link', label: 'Implementation Packages', href: '/implementation-packages' },
    { _type: 'link', label: 'monday.com Training', href: '/monday-training' },
    { _type: 'link', label: 'monday.com Implementation Consultants', href: '/monday-implementation-consultants' },
    { _type: 'link', label: 'monday CRM Consulting', href: '/monday-crm-consulting' },
  ])

  const footerDepartmentLinks = withKeys([
    { _type: 'link', label: 'monday.com Project Management', href: '/monday-consulting-solutions/monday-project-management' },
    { _type: 'link', label: 'monday.com Service', href: '/monday-consulting-solutions/monday-service' },
    { _type: 'link', label: 'monday.com HR Solutions', href: '/monday-consulting-solutions/monday-for-hr' },
    { _type: 'link', label: 'monday.com for Marketing & Creative', href: '/monday-for-marketing' },
    { _type: 'link', label: 'monday.com Finance', href: '/monday-consulting-solutions/monday-for-finance' },
    { _type: 'link', label: 'monday.com for Product Management', href: '/monday-consulting-solutions/monday-product-management' },
    { _type: 'link', label: 'Solar CRM & Work Management Solution', href: '/monday-consulting-solutions/solar-crm-solution' },
    { _type: 'link', label: 'AI Strategy & Execution', href: '/ai-strategy-and-execution' },
    { _type: 'link', label: 'Case Studies', href: '/customer-testimonials#case-studies' },
  ])

  const footerIndustryLinks = withKeys([
    { _type: 'link', label: 'monday.com for Construction', href: '/monday-for-construction' },
    { _type: 'link', label: 'monday.com for Manufacturing', href: '/monday-for-manufacturing' },
    { _type: 'link', label: 'monday.com for Retail', href: '/monday-for-retail' },
    { _type: 'link', label: 'monday.com for Professional Services', href: '/monday-for-professional-services' },
    { _type: 'link', label: 'monday.com for Government', href: '/monday-for-government' },
    { _type: 'link', label: 'monday.com for Marketing & Creative', href: '/monday-for-marketing' },
    { _type: 'link', label: 'monday.com for Real Estate', href: '/monday-for-real-estate' },
  ])

  // ---------- Carousel logos ----------
  const carouselLogos = withKeys(
    carouselRefs.map((c) => ({ _type: 'clientLogo', alt: c.alt, image: c.image }))
  )

  // ---------- Build the document ----------
  const data = {
    _type: 'siteSettings',
    phone: existing?.phone ?? PHONE_AU,
    calendlyLink: existing?.calendlyLink ?? CALENDLY_URL,
    ...(existing?.mondayAffiliateLink ? { mondayAffiliateLink: existing.mondayAffiliateLink } : {}),
    ...(existing?.footerText ? { footerText: existing.footerText } : {}),
    logo,
    logoWhite,
    logoRound,
    navigation,
    navbarPartnerBadges,
    footerPartnerLogos,
    socialLinks,
    offices,
    footerServicesLinks,
    footerDepartmentLinks,
    footerIndustryLinks,
    carouselLogos,
    badgeCertifications,
    badgeSecurity,
    badgeForrester,
    badgeMondayPartners,
  }

  const targetId = existing?._id || 'siteSettings'
  console.log(`— Upserting siteSettings (id: ${targetId})…`)
  await writeClient.createOrReplace({ _id: targetId, ...data })
  console.log('✓ siteSettings uploaded')

  // Verify
  const verify = await writeClient.fetch<{
    phone?: string
    calendlyLink?: string
    navigation?: unknown[]
    navbarPartnerBadges?: unknown[]
    footerPartnerLogos?: unknown[]
    socialLinks?: unknown[]
    offices?: unknown[]
    footerServicesLinks?: unknown[]
    footerDepartmentLinks?: unknown[]
    footerIndustryLinks?: unknown[]
    carouselLogos?: unknown[]
  }>(`*[_type == "siteSettings"][0]{
    phone, calendlyLink,
    navigation, navbarPartnerBadges, footerPartnerLogos, socialLinks, offices,
    footerServicesLinks, footerDepartmentLinks, footerIndustryLinks, carouselLogos
  }`)

  console.log('\n— Verification summary —')
  console.log(`  phone:                 ${verify?.phone}`)
  console.log(`  calendlyLink:          ${verify?.calendlyLink}`)
  console.log(`  navigation items:      ${verify?.navigation?.length ?? 0}`)
  console.log(`  navbarPartnerBadges:   ${verify?.navbarPartnerBadges?.length ?? 0}`)
  console.log(`  footerPartnerLogos:    ${verify?.footerPartnerLogos?.length ?? 0}`)
  console.log(`  socialLinks:           ${verify?.socialLinks?.length ?? 0}`)
  console.log(`  offices:               ${verify?.offices?.length ?? 0}`)
  console.log(`  footerServicesLinks:   ${verify?.footerServicesLinks?.length ?? 0}`)
  console.log(`  footerDepartmentLinks: ${verify?.footerDepartmentLinks?.length ?? 0}`)
  console.log(`  footerIndustryLinks:   ${verify?.footerIndustryLinks?.length ?? 0}`)
  console.log(`  carouselLogos:         ${verify?.carouselLogos?.length ?? 0}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
