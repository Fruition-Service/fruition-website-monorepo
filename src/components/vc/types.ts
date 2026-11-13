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
export interface VcLogoData { _key?: string; image?: VcImage; alt?: string; href?: string; shape?: string }
export interface VcStatData { _key?: string; value?: string; label?: string }
export interface VcItemData {
  _key?: string; label?: string; title?: string; body?: string; meta?: string; tags?: string[]
  image?: VcImage; linkLabel?: string; href?: string; ai?: boolean; cardLink?: boolean; bullets?: string[]
  aiLabel?: string; aiNote?: string; listClass?: string; bulletIcon?: string; metric?: string; metricLabel?: string; num?: string; kicker?: string; arrow?: boolean; icon?: string
}
export interface VcCaseData { _id: string; client?: string; label?: string; body?: string; tags?: string[]; results?: { _key?: string; value?: string; label?: string }[]; photo?: VcImage; logo?: VcImage; href?: string }
export interface VcQuoteData { _id: string; org?: string; quote?: string; name?: string; role?: string; initials?: string; photo?: VcImage; tag?: string }
export interface VcFaqItemData { _id: string; question?: string; answer?: PortableTextBlock[] }
export interface VcFaqTabData { _key?: string; label?: string; items?: VcFaqItemData[] }

interface Base {
  _key: string; _type: string; tone?: "plain" | "alt"; anchor?: string; sectionClass?: string
  /** True = exists on this page only, outside the group's shared template (docs/version-c.md "Page-specific sections"). */
  pageSpecific?: boolean; pageSpecificNote?: string
}

export interface VcHeroData extends Base {
  _type: "vcHero"; badge?: string; heading?: string; lead?: string; ctas?: VcCtaData[]
  art?: VcImage; stageClass?: string; stage?: VcNodeData[]; prompt?: { label?: string; placeholder?: string; ariaLabel?: string; sendLabel?: string; note?: string; href?: string; chips?: { _key?: string; label?: string; text?: string }[] }; frameSvg?: string; frameSvgAria?: string; frameClass?: string; credsClass?: string; variant?: string; artClass?: string; frameImage?: VcImage; creds?: VcLogoData[]; chipValue?: string; chipLabel?: string; floatBadges?: VcLogoData[]; floatBadgeClass?: string
  mapKind?: string; mapSvg?: string; mapAspect?: string; mapAria?: string; mapFlag?: string; mapLabel?: string
  pins?: { _key?: string; label?: string; left?: number; top?: number; side?: string; on?: boolean }[]
  stats?: VcStatData[]; statsNote?: string; spacer?: boolean; trustLabel?: string; searchPlaceholder?: string; searchClear?: boolean
  form?: { heading?: string; subheading?: string; phoneLabel?: string; messageLabel?: string; messagePlaceholder?: string; submitLabel?: string; successMessage?: string }; trustLogos?: VcLogoData[]
}
export interface VcLogosData extends Base { _type: "vcLogos"; head?: VcHeadData; gridClass?: string; logos?: VcLogoData[]; more?: string }
export interface VcStepsData extends Base {
  _type: "vcSteps"; head?: VcHeadData; layout?: string; titleClass?: string
  items?: { _key?: string; n?: string; bar?: number; title?: string; body?: string; bullets?: string[]; meta?: string }[]
}
export interface VcCasesData extends Base { _type: "vcCases"; head?: VcHeadData; cases?: VcCaseData[] }
/** A service deep dive: heading block, numbered approach steps and a 4-card grid. Page-specific by design. */
export interface VcDeepDiveData extends Base {
  _type: "vcDeepDive"; head?: VcHeadData; stepsHeading?: string; steps?: { _key?: string; title?: string; body?: string }[]
  cardsHeading?: string; cards?: { _key?: string; title?: string; body?: string }[]
}
/** One catalogued build in a solution finder. */
export interface VcFinderBuild {
  _key?: string; buildId?: string; industry?: string; name?: string; useCase?: string; description?: string
  hubs?: string; scope?: string; users?: string; strength?: string; outcomes?: string[]
  steps?: { _key?: string; label?: string; summary?: string; how?: string }[]
  roles?: { _key?: string; label?: string; text?: string }[]; phases?: string[]; kpis?: string[]; integrations?: string[]
}
/** A chat-style solution finder (industry, then builds, then a build's detail). Page-specific by design. */
export interface VcSolutionFinderData extends Base {
  _type: "vcSolutionFinder"; head?: VcHeadData; howTo?: string[]; platform?: string; label?: string; greeting?: string
  allLabel?: string; changePrompt?: string; scopePrompt?: string; scopeLabel?: string; scopeHref?: string; builds?: VcFinderBuild[]
}
export interface VcAuditData extends Base { _type: "vcAudit"; heading?: string; text?: string; cta?: VcCtaData }
export interface VcCardsData extends Base { _type: "vcCards"; head?: VcHeadData; layout?: string; imageFrame?: string; listClass?: string; titleClass?: string; tagClass?: string; sectionClass?: string; items?: VcItemData[] }
export interface VcProductsData extends Base { _type: "vcProducts"; head?: VcHeadData; items?: VcItemData[] }
export interface VcUseCasesData extends Base { _type: "vcUseCases"; head?: VcHeadData; source?: string; linkLabel?: string }
export interface VcProofData extends Base {
  _type: "vcProof"; layout?: string; filters?: { _key?: string; label?: string; key?: string }[]; badge?: string; heading?: string; lead?: string; ctas?: VcCtaData[]; quotes?: VcQuoteData[]
}
export interface VcPractitionersData extends Base { _type: "vcPractitioners"; paragraphs?: VcPara[] }
export interface VcBookingData extends Base { _type: "vcBooking"; badge?: string; heading?: string; lead?: string; calTitle?: string; tag?: string }
export interface VcFaqData extends Base { _type: "vcFaq"; badge?: string; heading?: string; tabs?: VcFaqTabData[] }
export interface VcClosingData extends Base { _type: "vcClosing"; badge?: string; heading?: string; lead?: string; ctas?: VcCtaData[] }

export interface VcPara { _key?: string; text?: string; style?: string }
export interface VcVideoData extends Base {
  _type: "vcVideo"; badge?: string; heading?: string; paragraphs?: VcPara[]
  facts?: { _key?: string; label?: string; value?: string }[]; youtubeId?: string; poster?: VcImage; caption?: string
}
export interface VcTextPairData extends Base { _type: "vcTextPair"; badge?: string; heading?: string; paragraphs?: VcPara[] }
export interface VcFixData extends Base {
  _type: "vcFix"; head?: VcHeadData; detailLabel?: string; cta?: VcCtaData
  items?: { _key?: string; title?: string; problem?: string; steps?: string[]; outcome?: string }[]
}
export interface VcIndustryTabsData extends Base {
  _type: "vcIndustryTabs"; head?: VcHeadData; benefitsLabel?: string; cta?: VcCtaData
  tabs?: { _key?: string; label?: string; title?: string; body?: string; benefits?: string[] }[]
}
export interface VcTrackData extends Base {
  _type: "vcTrack"; head?: VcHeadData; sizeLabel?: string; complexityLabel?: string; complexity?: string[]
  recLabel?: string; tracks?: { _key?: string; title?: string; body?: string; fit?: string }[]; cta?: VcCtaData; pills?: string[]
}
export interface VcTableData extends Base {
  _type: "vcTable"; head?: VcHeadData; variant?: string; columns?: string[]; rows?: { _key?: string; label?: string; no?: string; yes?: string }[]
}

export interface VcPartnerStatusData extends Base {
  _type: "vcPartnerStatus"; badgeImages?: VcLogoData[]; badge?: string; heading?: string
  points?: { _key?: string; n?: string; title?: string; body?: string }[]
}
export interface VcDirectoryData extends Base {
  _type: "vcDirectory"; head?: VcHeadData; variant?: string; filters?: { _key?: string; label?: string; key?: string }[]
  tiles?: { _key?: string; logo?: VcImage; logoShape?: string; tag?: string; title?: string; body?: string; href?: string; groups?: string[] }[]
}
export interface VcToolkitData extends Base {
  _type: "vcToolkit"; head?: VcHeadData; tiles?: { _key?: string; logo?: VcImage; logoShape?: string; title?: string; body?: string }[]
}

export interface VcStatsRowData extends Base { _type: "vcStatsRow"; head?: VcHeadData; stats?: VcStatData[]; note?: string; statsClass?: string; noteBelow?: boolean }
export interface VcTeamMember { _id: string; name?: string; role?: string; bio?: string; override?: string; roleOverride?: string; photo?: VcImage; linkedinUrl?: string }
export interface VcTeamData extends Base { _type: "vcTeam"; head?: VcHeadData; layout?: string; members?: VcTeamMember[] }
export interface VcAnswerData extends Base { _type: "vcAnswer"; badge?: string; heading?: string; body?: string }
export interface VcCoverageData extends Base {
  _type: "vcCoverage"; head?: VcHeadData; mapQuery?: string; mapTitle?: string; visitLabel?: string; visitHeading?: string
  visitAddress?: string; visitLinkLabel?: string; visitHref?: string; cityStyle?: string
  cities?: { _key?: string; label?: string; title?: string; flag?: string; hq?: boolean; body?: string }[]
}

export interface VcLeadershipData extends Base { _type: "vcLeadership"; head?: VcHeadData; ceo?: VcTeamMember; quote?: string; caption?: string; people?: VcTeamMember[] }
export interface VcOfficesData extends Base { _type: "vcOffices"; head?: VcHeadData }
export interface VcTeamTabsData extends Base {
  _type: "vcTeamTabs"; badge?: string; headingPrefix?: string
  tabs?: { _key?: string; label?: string; flag?: string; title?: string; leaders?: VcTeamMember[]; members?: VcTeamMember[] }[]
}
export interface VcOffice { _key?: string; city?: string; label?: string; flag?: string; address?: string; addressUrl?: string; phone?: string; phoneTel?: string; href?: string }

export interface VcChannelsData extends Base {
  _type: "vcChannels"; badge?: string; heading?: string; rows?: { _key?: string; label?: string; value?: string; href?: string }[]
  followLabel?: string; socials?: { _key?: string; network?: string; label?: string; href?: string }[]
  tilesLabel?: string; tilesLink?: VcCtaData; tiles?: VcLogoData[]; security?: VcLogoData[]
}

export interface VcRemoteData extends Base {
  _type: "vcRemote"; badge?: string; heading?: string; lead?: string; perks?: { _key?: string; icon?: string; text?: string }[]
  listLabel?: string; timeLabel?: string; places?: { _key?: string; flag?: string; title?: string; line?: string; label?: string; tz?: string }[]
}
export interface VcFormEmbedData extends Base { _type: "vcFormEmbed"; head?: VcHeadData; src?: string; title?: string; note?: string }

export interface VcStoryData {
  _id: string; num?: string; client?: string; sub?: string; solution?: string; weeks?: string; logo?: VcImage
  metrics?: { _key?: string; value?: string; label?: string; sub?: string }[]; quote?: string; people?: { _key?: string; name?: string; role?: string }[]
  challenge?: PortableTextBlock[]; solutionText?: PortableTextBlock[]; impact?: PortableTextBlock[]
  location?: string; employees?: string; industry?: string; useCase?: string; tags?: string[]
}
export interface VcStoriesData extends Base { _type: "vcStories"; head?: VcHeadData; filterLabel?: string; countText?: string; stories?: VcStoryData[] }

export interface VcBlogListData extends Base { _type: "vcBlogList"; allLabel?: string; otherLabel?: string; emptyText?: string }
export interface VcFaqHubData extends Base {
  _type: "vcFaqHub"; sideLabel?: string; allLabel?: string
  categories?: { _key?: string; key?: string; name?: string; description?: string; groups?: { _key?: string; name?: string; items?: VcFaqItemData[] }[] }[]
}

export interface VcPriceCardData {
  _key?: string; cardClass?: string; logo?: VcImage; logoShape?: string; kicker?: string; title?: string; body?: string; meta?: string
  priceLabel?: string; price?: string; unit?: string; quote?: string; bestLabel?: string; best?: string; bullets?: string[]
  cta?: VcCtaData; linkLabel?: string; href?: string
}
export interface VcPriceCardsData extends Base {
  _type: "vcPriceCards"; head?: VcHeadData; gridClass?: string; items?: VcPriceCardData[]
  notes?: { _key?: string; label?: string; body?: string; links?: { _key?: string; label?: string; href?: string }[] }[]
}
export interface VcLinkCardsData extends Base { _type: "vcLinkCards"; head?: VcHeadData; gridClass?: string; items?: { _key?: string; title?: string; href?: string }[] }
export interface VcServicesData extends Base {
  _type: "vcServices"; head?: VcHeadData; footnote?: string
  tabs?: { _key?: string; label?: string; kicker?: string; title?: string; body?: string; fromLabel?: string; from?: string; cta?: VcCtaData; rows?: { _key?: string; name?: string; note?: string; price?: string; href?: string }[] }[]
}
export interface VcFactsData extends Base { _type: "vcFacts"; head?: VcHeadData; rows?: { _key?: string; label?: string; value?: string }[] }

export interface VcIndustryGridData extends Base { _type: "vcIndustryGrid"; head?: VcHeadData; labelTemplate?: string }
export interface VcCatalogueData extends Base {
  _type: "vcCatalogue"; head?: VcHeadData; departmentLabel?: string; allDepartmentsLabel?: string; searchLabel?: string; searchPlaceholder?: string
  filterLabel?: string; aiOnlyLabel?: string; countAll?: string; countFiltered?: string; emptyText?: string; ownLabel?: string; aiLabel?: string; linkLabel?: string; moreLabel?: string
  overrides?: { _key?: string; id?: string; title?: string; summary?: string; metric?: string }[]
}

export interface VcAskDemoData extends Base {
  _type: "vcAskDemo"; head?: VcHeadData; note?: string
  ui?: { _key?: string; id?: string; text?: string }[]
  scenarios?: { _key?: string; id?: string; chip?: string; title?: string; user?: string; goals?: string; tools?: string; reply?: string[]; matches?: string[] }[]
  solutions?: { _key?: string; name?: string; why?: string; fit?: string[]; strength?: string; watch?: string; rec?: string; phases?: string[] }[]
}

export interface VcQuizData extends Base {
  _type: "vcQuiz"; head?: VcHeadData
  ui?: { _key?: string; id?: string; text?: string }[]
  dims?: string[]
  questions?: { _key?: string; kicker?: string; title?: string; help?: string; dim?: number | null; options?: { _key?: string; label?: string; hint?: string; value?: number }[] }[]
}

export interface VcNodeData {
  _key?: string; tag?: string; className?: string; style?: string; text?: string; image?: VcImage; svg?: string; href?: string; attrs?: string[]; children?: VcNodeData[]
}
export interface VcMarkupData { _key: string; _type: "vcMarkup"; sectionClass?: string; anchor?: string; dataSec?: string; behaviour?: string; nodes?: VcNodeData[] }
export interface VcInsightsData extends Base { _type: "vcInsights"; head?: VcHeadData }

export type VcSection =
  | VcHeroData | VcLogosData | VcStepsData | VcCasesData | VcAuditData | VcCardsData | VcProductsData
  | VcUseCasesData | VcProofData | VcPractitionersData | VcBookingData | VcFaqData | VcClosingData
  | VcVideoData | VcTextPairData | VcFixData | VcIndustryTabsData | VcTrackData | VcTableData
  | VcPartnerStatusData | VcDirectoryData | VcToolkitData | VcStatsRowData | VcTeamData | VcAnswerData | VcCoverageData
  | VcPriceCardsData | VcLinkCardsData | VcServicesData | VcFactsData | VcIndustryGridData | VcCatalogueData | VcAskDemoData | VcQuizData | VcMarkupData | VcInsightsData
  | VcLeadershipData | VcOfficesData | VcTeamTabsData | VcChannelsData | VcRemoteData | VcFormEmbedData | VcStoriesData | VcBlogListData | VcFaqHubData
  | VcDeepDiveData | VcSolutionFinderData

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
  offices?: VcOffice[]
}
