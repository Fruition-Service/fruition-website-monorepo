/**
 * Push the Philippines team roster onto the monday-partner-philippines
 * locationPage doc so the frontend can filter the team grid by name.
 *
 *   npx tsx scripts/sanity-migrate/monday-partner-philippines-team.ts
 */
import { writeClient } from './lib'

const SLUG = 'monday-partner-philippines'
const TEAM_MEMBER_NAMES = [
  'Josh Jebathilak',
  'Suzzane Castro',
  'Annica Galang',
  'Pierre Santos',
  'Ronelyn Tabuena',
  'Julia Maningas',
  'Prince Ericson Posadas',
  'Nikki Glucksman',
  'Thana Witchawut',
]

async function main() {
  const doc = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "locationPage" && slug.current == $slug][0]{ _id }`,
    { slug: SLUG },
  )
  if (!doc?._id) throw new Error(`No locationPage with slug ${SLUG}`)

  await writeClient
    .patch(doc._id)
    .set({ teamMemberNames: TEAM_MEMBER_NAMES })
    .commit()
  console.log(`✅ patched locationPage:${SLUG} teamMemberNames`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
