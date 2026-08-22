/**
 * The emoji offered by the composer's picker.
 *
 * Hand-picked rather than the full Unicode set, and stored in code rather than
 * pulled from a package: a social caption needs a few hundred well-chosen
 * glyphs, not six thousand, and the alternatives all ship a megabyte of sprite
 * data to render a grid we already know how to draw. Everything here is
 * plain text — the emoji IS the character, so it survives the round trip
 * through Supabase, Zernio and every platform without encoding tricks.
 *
 * Each entry is "<emoji> <space-separated search words>". The first token is
 * what gets inserted; the rest is only ever matched against.
 */

export interface EmojiGroup {
  name: string
  entries: string[]
}

export const EMOJI_GROUPS: EmojiGroup[] = [
  {
    name: "Faces",
    entries: [
      "😀 grin happy smile",
      "😃 smiley happy joy",
      "😄 smile happy laugh",
      "😁 beam grin teeth",
      "😆 laugh satisfied",
      "😅 sweat laugh relief",
      "🤣 rofl rolling laughing",
      "😂 joy tears laughing cry",
      "🙂 slight smile",
      "🙃 upside down silly",
      "😉 wink",
      "😊 blush smile happy",
      "😇 halo innocent angel",
      "🥰 love hearts adore",
      "😍 heart eyes love",
      "🤩 star struck amazed wow",
      "😘 kiss blow",
      "😋 yum tasty delicious",
      "😎 cool sunglasses",
      "🤓 nerd glasses geek",
      "🧐 monocle scrutiny inspect",
      "🤔 think thinking hmm",
      "🤨 raised eyebrow skeptical",
      "😐 neutral straight face",
      "😶 no mouth speechless",
      "🙄 eye roll",
      "😏 smirk",
      "😴 sleep zzz tired",
      "🤤 drool",
      "😌 relieved calm",
      "😔 sad pensive",
      "😪 sleepy tired",
      "🤯 mind blown explode",
      "😳 flushed shocked",
      "🥵 hot heat sweating",
      "🥶 cold freezing",
      "😱 scream shock fear",
      "😨 fearful scared",
      "😰 anxious sweat",
      "😥 sad disappointed",
      "😢 cry sad tear",
      "😭 sob crying loud",
      "😤 triumph steam determined",
      "😡 angry mad rage",
      "🤬 cursing swearing",
      "🤗 hug hugging",
      "🤭 oops giggle hand over mouth",
      "🤫 shush quiet secret",
      "🤝 handshake deal agreement partner",
      "🙏 pray thanks please grateful",
      "🥳 party celebrate hooray",
      "🤪 zany crazy silly",
      "😬 grimace awkward",
      "🫠 melting overwhelmed",
      "🫡 salute respect yes",
      "🫶 heart hands love",
      "🤷 shrug dunno",
      "🤦 facepalm",
    ],
  },
  {
    name: "Gestures",
    entries: [
      "👍 thumbs up yes good like",
      "👎 thumbs down no bad",
      "👏 clap applause bravo",
      "🙌 raised hands celebrate praise",
      "👋 wave hello hi bye",
      "✌️ peace victory",
      "🤞 fingers crossed luck hope",
      "👌 ok perfect",
      "🤙 call me shaka",
      "💪 muscle strong strength",
      "🫵 point you",
      "👉 point right",
      "👈 point left",
      "👇 point down below",
      "☝️ point up",
      "✍️ writing hand write",
      "🖐️ hand five stop",
      "🫰 fingers money snap",
      "🧠 brain smart think",
      "👀 eyes look watch see",
      "🦻 listen hearing",
      "🗣️ speaking talk announce",
      "👤 person user profile",
      "👥 people users team",
      "🧑‍💻 developer coder engineer",
      "👩‍💼 businesswoman office",
      "👨‍💼 businessman office",
      "🧑‍🏫 teacher trainer",
      "🕺 dancing celebrate",
      "🏃 running run fast",
    ],
  },
  {
    name: "Business",
    entries: [
      "📈 chart up growth increase trend",
      "📉 chart down decline loss",
      "📊 bar chart data analytics stats",
      "💹 chart yen growth market",
      "💰 money bag revenue cash",
      "💵 dollars cash money",
      "💸 money flying spend cost",
      "💳 card payment credit",
      "🧾 receipt invoice billing",
      "🏦 bank finance",
      "🤑 money face profit",
      "🎯 target goal aim bullseye",
      "🏆 trophy win award best",
      "🥇 gold medal first winner",
      "🚀 rocket launch growth fast ship",
      "⚡ lightning fast speed power",
      "🔥 fire hot trending popular",
      "✨ sparkles new shiny magic",
      "💡 idea lightbulb insight",
      "🧩 puzzle piece integration fit",
      "🛠️ tools build fix",
      "⚙️ gear settings automation config",
      "🔧 wrench fix maintenance",
      "🔗 link chain url",
      "📌 pin pinned important",
      "📍 location place map pin",
      "🗓️ calendar schedule date",
      "⏰ alarm clock time deadline",
      "⏳ hourglass waiting time",
      "✅ check done complete yes tick",
      "☑️ checkbox ticked done",
      "❌ cross no wrong error",
      "⚠️ warning caution alert",
      "🚨 siren alert urgent",
      "🆕 new badge",
      "🆓 free",
      "🔝 top best",
      "📢 megaphone announce shout",
      "📣 megaphone marketing promote",
      "🔔 bell notification remind",
      "💼 briefcase work business job",
      "🏢 office building company",
      "🏭 factory industry manufacturing",
      "🏗️ construction building site",
      "🚧 roadworks construction wip",
      "📦 package box shipping delivery",
      "🚚 truck delivery logistics",
      "🧱 brick foundation",
      "🗂️ folders files organise",
      "📋 clipboard list checklist",
      "📝 memo note write",
      "📄 document page file",
      "📑 tabs bookmark documents",
      "📁 folder file",
      "🖇️ paperclip attach",
      "🖊️ pen sign write",
      "✒️ nib sign signature",
      "🔍 search magnify find seo",
      "🔎 search magnify right",
      "🧮 abacus calculate numbers",
      "⚖️ scales legal balance fair",
      "🤖 robot ai automation bot",
      "🛡️ shield security protect",
      "🔒 lock secure private",
      "🔓 unlock open access",
      "🔑 key access unlock",
      "☁️ cloud saas hosting",
      "🌐 globe web internet global",
      "📡 satellite signal broadcast",
      "🔋 battery power charge",
      "🧭 compass direction strategy",
      "🪜 ladder step climb",
      "🧵 thread series",
      "♻️ recycle sustainable loop",
      "💬 speech bubble comment chat",
      "💭 thought bubble idea",
      "🗨️ speech left comment",
      "📞 phone call telephone",
      "📱 mobile phone smartphone",
      "💻 laptop computer work",
      "🖥️ desktop monitor screen",
      "⌨️ keyboard typing",
      "🖱️ mouse click",
      "🖨️ printer print",
      "💾 floppy save disk",
      "📧 email mail message",
      "📨 incoming email message",
      "📬 mailbox inbox",
      "📮 postbox send",
      "✉️ envelope email letter",
    ],
  },
  {
    name: "Symbols",
    entries: [
      "❤️ red heart love",
      "🧡 orange heart",
      "💛 yellow heart",
      "💚 green heart",
      "💙 blue heart",
      "💜 purple heart",
      "🖤 black heart",
      "🤍 white heart",
      "💯 hundred perfect score",
      "‼️ double exclamation important",
      "❓ question mark",
      "❗ exclamation important",
      "⭐ star favourite rating",
      "🌟 glowing star shine",
      "💫 dizzy sparkle",
      "🔴 red circle dot live",
      "🟢 green circle ok live",
      "🟡 yellow circle warning",
      "🔵 blue circle",
      "🟣 purple circle",
      "⚫ black circle",
      "⚪ white circle",
      "🔷 blue diamond",
      "🔶 orange diamond",
      "▶️ play start",
      "⏸️ pause",
      "⏭️ next skip",
      "🔁 repeat loop",
      "🔀 shuffle random",
      "➡️ arrow right next",
      "⬅️ arrow left back",
      "⬆️ arrow up",
      "⬇️ arrow down",
      "↗️ arrow up right growth",
      "↘️ arrow down right decline",
      "➕ plus add",
      "➖ minus remove",
      "✖️ multiply times",
      "➗ divide",
      "♾️ infinity unlimited",
      "©️ copyright",
      "®️ registered trademark",
      "™️ trademark",
      "#️⃣ hash number",
      "1️⃣ one first",
      "2️⃣ two second",
      "3️⃣ three third",
      "4️⃣ four",
      "5️⃣ five",
    ],
  },
  {
    name: "Nature",
    entries: [
      "🌱 seedling growth start",
      "🌿 herb plant green",
      "🍀 four leaf clover luck",
      "🌳 tree nature",
      "🌊 wave water ocean",
      "🌞 sun sunny bright",
      "🌙 moon night",
      "☀️ sun clear weather",
      "⛅ partly cloudy weather",
      "🌧️ rain weather",
      "❄️ snowflake cold winter",
      "🌈 rainbow pride colour",
      "🌍 earth globe europe africa",
      "🌏 earth globe asia australia",
      "🌎 earth globe americas",
      "🐝 bee busy",
      "🦅 eagle",
      "🐶 dog puppy",
      "🐱 cat kitten",
      "🦄 unicorn rare startup",
      "🐢 turtle slow",
      "🦉 owl wise",
    ],
  },
  {
    name: "Food",
    entries: [
      "☕ coffee morning cafe",
      "🍵 tea green",
      "🍺 beer drink cheers",
      "🍻 cheers beers celebrate",
      "🥂 champagne cheers celebrate toast",
      "🍾 bottle celebrate pop",
      "🍕 pizza food",
      "🍔 burger food",
      "🌮 taco food",
      "🍎 apple fruit healthy",
      "🥑 avocado",
      "🍰 cake dessert birthday",
      "🎂 birthday cake celebrate",
      "🍪 cookie biscuit",
      "🍫 chocolate",
      "🥤 drink cup soda",
      "🧊 ice cold cube",
    ],
  },
  {
    name: "Travel",
    entries: [
      "✈️ plane flight travel",
      "🚗 car drive",
      "🚕 taxi cab",
      "🚌 bus transit",
      "🚆 train rail",
      "🚢 ship boat cargo",
      "🛳️ cruise ship",
      "🏠 house home",
      "🏡 home garden house",
      "🏙️ city skyline urban",
      "🌆 city sunset dusk",
      "🗺️ map world plan",
      "🧳 luggage suitcase travel",
      "🎪 tent event",
      "🎤 microphone speak podcast",
      "🎧 headphones audio listen",
      "🎥 camera film video",
      "📷 camera photo",
      "🎬 clapper film production",
      "🖼️ picture frame image",
      "🎨 art palette design creative",
      "🏅 medal award",
      "🎁 gift present offer",
      "🎉 party popper celebrate launch",
      "🎊 confetti celebrate",
      "🏁 chequered flag finish",
    ],
  },
  {
    name: "Flags",
    entries: [
      "🇦🇺 australia au aussie",
      "🇸🇬 singapore sg",
      "🇬🇧 united kingdom uk britain gb",
      "🇺🇸 united states usa america us",
      "🇳🇿 new zealand nz",
      "🇵🇭 philippines ph",
      "🇮🇳 india in",
      "🇨🇦 canada ca",
      "🇮🇪 ireland ie",
      "🇦🇪 uae dubai emirates",
      "🏳️‍🌈 pride rainbow flag",
    ],
  },
]

/** The glyph an entry inserts (everything before the first space). */
export function glyphOf(entry: string): string {
  const i = entry.indexOf(" ")
  return i === -1 ? entry : entry.slice(0, i)
}

/**
 * Entries matching a search, or every group unchanged when the search is empty.
 *
 * Ranked, not just filtered: "australia" matches both the flag and the globe
 * that happens to list Australia among its keywords, and the flag is obviously
 * what was meant. A whole-keyword hit outranks a hit inside a longer word.
 */
export function searchEmoji(query: string): EmojiGroup[] {
  const q = query.trim().toLowerCase()
  if (!q) return EMOJI_GROUPS
  const words = q.split(/\s+/)

  const scored: Array<{ entry: string; score: number }> = []
  for (const entry of EMOJI_GROUPS.flatMap((g) => g.entries)) {
    // Skip the glyph itself: it's never what someone types.
    const keywords = entry.toLowerCase().split(" ").slice(1)
    let score = 0
    const matchedAll = words.every((w) => {
      const exact = keywords.indexOf(w)
      // The first keyword is the entry's own name, so a hit there is the
      // strongest signal: "australia" means the flag, not the globe that
      // lists Australia fourth.
      if (exact === 0) {
        score += 3
        return true
      }
      if (exact > 0) {
        score += 2
        return true
      }
      if (keywords.some((k) => k.startsWith(w))) {
        score += 1
        return true
      }
      return keywords.some((k) => k.includes(w))
    })
    if (matchedAll) scored.push({ entry, score })
  }
  if (!scored.length) return []

  scored.sort((a, b) => b.score - a.score)
  return [{ name: "Results", entries: scored.map((s) => s.entry) }]
}
