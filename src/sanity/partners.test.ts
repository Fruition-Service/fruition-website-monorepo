import { describe, expect, it } from 'vitest'
import { partnerBadgeMap, resolvePartnerImages, type PartnerDoc } from './partners'

const img = (ref: string, alt?: string) => ({ _type: 'image', asset: { _type: 'reference', _ref: ref }, ...(alt ? { alt } : {}) })
const partners: PartnerDoc[] = [
  { _id: 'partner-openai', key: 'openai', badge: img('image-new-badge', 'OpenAI Select Partner'), mark: img('image-mark') },
  { _id: 'partner-empty', key: 'empty' },
]

describe('resolvePartnerImages', () => {
  it('swaps a linked logo, tile and markup image for the partner image', () => {
    const tree = {
      sections: [
        { _type: 'vcLogos', logos: [{ _type: 'vcLogo', alt: 'Old', image: img('image-old'), partner: { _ref: 'partner-openai' } }] },
        { _type: 'vcDirectory', tiles: [{ _type: 'vcTile', title: 'OpenAI', logo: img('image-old2'), partner: { _ref: 'partner-openai' }, partnerImage: 'mark' }] },
        { _type: 'vcMarkup', nodes: [{ _type: 'vcNode', tag: 'img', image: img('image-old3', 'x'), partner: { _ref: 'partner-openai' } }] },
      ],
    }
    resolvePartnerImages(tree, partners)
    const [logos, dir, markup] = tree.sections as any[]
    expect(logos.logos[0].image.asset._ref).toBe('image-new-badge')
    expect(logos.logos[0].image.alt).toBe('OpenAI Select Partner')
    expect(dir.tiles[0].logo.asset._ref).toBe('image-mark')
    expect(markup.nodes[0].image.asset._ref).toBe('image-new-badge')
  })

  it('keeps the own image when the partner or its image is missing', () => {
    const tree = [
      { _type: 'vcLogo', image: img('image-keep'), partner: { _ref: 'partner-empty' } },
      { _type: 'vcLogo', image: img('image-keep2'), partner: { _ref: 'partner-gone' } },
      { _type: 'vcTile', logo: img('image-keep3'), partner: { _ref: 'partner-openai' }, partnerImage: 'logo' },
    ]
    resolvePartnerImages(tree, partners)
    expect(tree.map((n: any) => (n.image ?? n.logo).asset._ref)).toEqual(['image-keep', 'image-keep2', 'image-keep3'])
  })

  it('maps partner keys to badges', () => {
    expect(Object.keys(partnerBadgeMap(partners))).toEqual(['openai'])
  })
})
