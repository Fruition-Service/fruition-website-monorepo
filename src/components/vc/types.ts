import type { PortableTextBlock } from "@portabletext/types"

/** A Sanity image as the Version C queries project it (asset dimensions included). */
export interface VcImage {
  /** Raw reference; the id encodes the dimensions (image-<hash>-<w>x<h>-<ext>). */
  asset?: { _ref?: string; _id?: string }
  alt?: string
  hotspot?: unknown
  crop?: unknown
}

export interface VcHeadData { badge?: string; heading?: string; lead?: string }
export interface VcCtaData { label?: string; href?: string; style?: "primary" | "outline" | "inverse" | "ghost"; arrow?: boolean; newTab?: boolean }
export interface VcLogoData { _key?: string; image?: VcImage; alt?: string; href?: string }
export interface VcStatData { _key?: string; value?: string; label?: string }
export interface VcItemData {
  _key?: string; label?: string; title?: string; body?: string; meta?: string; tags?: string[]
  image?: VcImage; linkLabel?: string; href?: string; ai?: boolean; cardLink?: boolean
}
export interface VcCaseData { _id: string; client?: string; label?: string; body?: string; tags?: string[]; results?: { _key?: string; value?: string; label?: string }[]; photo?: VcImage; logo?: VcImage; href?: string }
export interface VcQuoteData { _id: string; org?: string; quote?: string; name?: string; role?: string; initials?: string }
export interface VcFaqItemData { _id: string; question?: string; answer?: PortableTextBlock[] }
export interface VcFaqTabData { _key?: string; label?: string; items?: VcFaqItemData[] }

interface Base { _key: string; _type: string; tone?: "plain" | "alt"; anchor?: string }

export interface VcHeroData extends Base {
  _type: "vcHero"; badge?: string; heading?: string; lead?: string; ctas?: VcCtaData[]
  art?: VcImage; variant?: string; artClass?: string; frameImage?: VcImage; creds?: VcLogoData[]; chipValue?: string; chipLabel?: string; floatBadge?: VcImage; floatBadgeAlt?: string
  stats?: VcStatData[]; statsNote?: string; trustLabel?: string; trustLogos?: VcLogoData[]
}
export interface VcLogosData extends Base { _type: "vcLogos"; head?: VcHeadData; logos?: VcLogoData[]; more?: string }
export interface VcStepsData extends Base {
  _type: "vcSteps"; head?: VcHeadData; layout?: string
  items?: { _key?: string; n?: string; title?: string; body?: string; meta?: string }[]
}
export interface VcCasesData extends Base { _type: "vcCases"; head?: VcHeadData; cases?: VcCaseData[] }
export interface VcAuditData extends Base { _type: "vcAudit"; heading?: string; text?: string; cta?: VcCtaData }
export interface VcCardsData extends Base { _type: "vcCards"; head?: VcHeadData; layout?: string; imageFrame?: string; tagClass?: string; sectionClass?: string; items?: VcItemData[] }
export interface VcProductsData extends Base { _type: "vcProducts"; head?: VcHeadData; items?: VcItemData[] }
export interface VcUseCasesData extends Base { _type: "vcUseCases"; head?: VcHeadData; source?: string; linkLabel?: string }
export interface VcProofData extends Base {
  _type: "vcProof"; layout?: string; badge?: string; heading?: string; lead?: string; ctas?: VcCtaData[]; quotes?: VcQuoteData[]
}
export interface VcPractitionersData extends Base { _type: "vcPractitioners" }
export interface VcBookingData extends Base { _type: "vcBooking"; badge?: string; heading?: string; lead?: string; calTitle?: string }
export interface VcFaqData extends Base { _type: "vcFaq"; badge?: string; heading?: string; tabs?: VcFaqTabData[] }
export interface VcClosingData extends Base { _type: "vcClosing"; badge?: string; heading?: string; lead?: string; ctas?: VcCtaData[] }

export type VcSection =
  | VcHeroData | VcLogosData | VcStepsData | VcCasesData | VcAuditData | VcCardsData | VcProductsData
  | VcUseCasesData | VcProofData | VcPractitionersData | VcBookingData | VcFaqData | VcClosingData

export interface VcPageData {
  _id: string; title?: string; path: string; group?: string
  seoTitle?: string; seoDescription?: string; ogImage?: VcImage
  sections?: VcSection[]
}

export interface VcSharedData {
  practitioners?: {
    badge?: string; heading?: string; body?: string[]; photo?: VcImage; name?: string; role?: string
    facts?: { _key?: string; label?: string; value?: string }[]; pills?: string[]
  }
  bookingCalTitle?: string
  bookingEmail?: string
}
