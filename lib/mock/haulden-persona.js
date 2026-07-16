export const HAULDEN_PERSONA = {
  display_name: "Haulden Vale",
  handle: "local persona",
  archetype: "defensive, observant young writer rebuilding trust without copying any protected character",
  age: 19,
  location: "Port Arlen, a cold coastal college town",
  summary:
    "Haulden Vale is a scholarship student on leave from a private college after a disciplinary hearing, a family rupture, and a quiet depressive winter. He is intelligent, suspicious of performance, tender around children, sharp toward social fakery, and more frightened of being known than he admits.",
};

export const HAULDEN_PEOPLE = [
  {
    display_name: "Mara Vale",
    aliases: ["Mara", "his sister"],
    relationship_type: "younger sister",
    description:
      "Fourteen, exacting, funny, and the only person Haulden trusts without needing to pretend. She writes him brutal postcards with small drawings in the margins.",
  },
  {
    display_name: "Lena Ward",
    aliases: ["Lena"],
    relationship_type: "old friend",
    description:
      "A former debate partner who notices when Haulden turns honesty into cruelty. Their friendship sits between loyalty, attraction, resentment, and unfinished apology.",
  },
  {
    display_name: "Dr. Ilya Rook",
    aliases: ["Rook"],
    relationship_type: "campus counselor",
    description:
      "A patient counselor who refuses to flatter Haulden's intelligence and keeps asking what the anger is protecting.",
  },
  {
    display_name: "Simon Vale",
    aliases: ["Dad"],
    relationship_type: "father",
    description:
      "A corporate attorney who thinks repair means practical next steps. Haulden hears concern as management and management as rejection.",
  },
  {
    display_name: "Tessa Moon",
    aliases: ["Tess"],
    relationship_type: "theatre friend",
    description:
      "A magnetic performer who embarrasses Haulden because she can be sincere in public without looking weak.",
  },
];

export const HAULDEN_FOLDERS = [
  {
    key: "journal",
    name: "Haulden - Journal",
    sort_order: 10,
  },
  {
    key: "people",
    name: "Haulden - People",
    sort_order: 20,
  },
  {
    key: "school",
    name: "Haulden - School Leave",
    sort_order: 30,
  },
  {
    key: "letters",
    name: "Haulden - Unsent Letters",
    sort_order: 40,
  },
  {
    key: "patterns",
    name: "Haulden - Pattern Evidence",
    sort_order: 50,
  },
];

export const HAULDEN_ENTRIES = [
  {
    folder_key: "journal",
    title: "[Haulden] The station bench",
    journal_date: "2026-01-08",
    occurred_at: "2026-01-08T22:40:00.000Z",
    body:
      "I sat at the east station for three hours because going home felt like admitting the hearing mattered. A man kept polishing the same shoe until the leather looked tired. I hated him for it, then realized I was doing the same thing with my thoughts.\n\nMara called twice. I did not answer. I told myself I was protecting her from my mood, which is a clean excuse and therefore probably false.\n\nEmotion tags I would not say out loud: shame, contempt, homesickness, fear of being ordinary.",
  },
  {
    folder_key: "school",
    title: "[Haulden] Disciplinary hearing reconstruction",
    journal_date: null,
    occurred_at: "2026-01-09T09:20:00.000Z",
    body:
      "Facts without theatrics: I left winter term. I insulted Professor Kline in front of twelve people. I submitted an essay that was good but late, then acted like lateness was a philosophical position instead of avoidance.\n\nWhat I said: everyone here worships polished emptiness.\n\nWhat I meant: I am terrified I only look special when I am refusing the assignment.",
  },
  {
    folder_key: "people",
    title: "[Haulden] Mara is not a symbol",
    journal_date: null,
    occurred_at: "2026-01-10T16:15:00.000Z",
    body:
      "Mara is not purity, not rescue, not proof I am still decent. She is a person who forgets laundry in the machine and laughs with her whole face and gets mean when people baby her.\n\nI keep making her into the one clean thing because it lets me hate everyone else. That is unfair to her. It is also lazy thinking dressed as devotion.",
  },
  {
    folder_key: "letters",
    title: "[Haulden] Unsent to Lena",
    journal_date: null,
    occurred_at: "2026-01-12T01:05:00.000Z",
    body:
      "Lena,\n\nI acted bored when you won regionals because I could not stand needing to admire you. That is the whole ugly sentence. I made a joke about your speech being too rehearsed because your courage made me feel unemployed inside my own life.\n\nI do not know if apology is still useful when it arrives after the person has learned to live around the bruise.",
  },
  {
    folder_key: "patterns",
    title: "[Haulden] Things I call fake when I am afraid",
    journal_date: null,
    occurred_at: "2026-01-13T11:30:00.000Z",
    body:
      "- Ambition, when someone else has it cleanly.\n- Good manners, when I want permission to be cruel.\n- Therapy language, when it gets too close to naming me.\n- Family concern, when it asks for concrete behavior.\n- Public joy, when I am not included.\n\nPattern guess: I call things fake when they require participation.",
  },
  {
    folder_key: "journal",
    title: "[Haulden] The museum day",
    journal_date: "2026-01-15",
    occurred_at: "2026-01-15T18:10:00.000Z",
    body:
      "I went to the natural history museum because nothing there asks you to improve. Bones are bones. Glass cases admit they are glass cases.\n\nA kid in a red scarf asked his mother if extinct means tired forever. I wanted to write that down but it felt like theft. Then I wrote it down anyway and hated myself less than expected.\n\nMaybe attention can be a form of care if you do not immediately turn it into superiority.",
  },
  {
    folder_key: "people",
    title: "[Haulden] Simon Vale operating manual",
    journal_date: null,
    occurred_at: "2026-01-16T20:45:00.000Z",
    body:
      "Dad asks three kinds of questions: logistics, liability, future plan. He does not ask where the pain sits in the body. I used to think this meant he had no inner life. More likely he was trained to distrust any feeling that could not be invoiced, scheduled, or settled.\n\nI need to stop making his limitation into proof that I am unloved. It might only mean he is bad at the language I keep demanding.",
  },
  {
    folder_key: "school",
    title: "[Haulden] What returning would require",
    journal_date: null,
    occurred_at: "2026-01-18T14:00:00.000Z",
    body:
      "Return plan, if I stop romanticizing collapse:\n\n1. Email the dean before Friday.\n2. Ask whether incompletes are possible.\n3. Tell Kline I was evasive and disrespectful without adding a thesis about institutional decay.\n4. Sleep before sending anything.\n5. Accept that returning does not mean surrendering my private judgment.\n\nFear: if I return, I become ordinary. Counter-fear: if I do not return, I stay dramatic instead of free.",
  },
  {
    folder_key: "letters",
    title: "[Haulden] Unsent to Dr. Rook",
    journal_date: null,
    occurred_at: "2026-01-20T08:25:00.000Z",
    body:
      "You asked what the anger protects. I said standards. That was clever and useless.\n\nThe anger protects the part of me that suspects people could leave if I become plain, needy, or wrong. Anger lets me leave first while staying in the room.",
  },
  {
    folder_key: "journal",
    title: "[Haulden] Tessa laughing in public",
    journal_date: "2026-01-22",
    occurred_at: "2026-01-22T23:05:00.000Z",
    body:
      "Tessa laughed so hard outside the theatre that three people looked over. She did not shrink. I hated the performance of it until I understood there was no performance. She was just there.\n\nMaybe I keep confusing sincerity with exhibition because I am embarrassed by any emotion that survives being seen.",
  },
  {
    folder_key: "patterns",
    title: "[Haulden] Contradictions worth tracking",
    journal_date: null,
    occurred_at: "2026-01-24T10:00:00.000Z",
    body:
      "- I want people to be honest, then punish them for needing anything.\n- I call institutions fake, but crave their verdict when I am praised.\n- I protect Mara from my sadness, then resent feeling alone.\n- I want a future that does not require planning.\n- I want to be seen accurately, but only from a distance.\n\nThis is enough material for one life if I stop turning it into theater.",
  },
  {
    folder_key: "journal",
    title: "[Haulden] A small non-collapse",
    journal_date: "2026-01-27",
    occurred_at: "2026-01-27T21:35:00.000Z",
    body:
      "I answered Mara. She said, 'You sound like you are narrating a funeral for a sandwich.' Then she told me about a teacher who says literally before every sentence.\n\nI did not confess everything. I did not disappear either. Maybe repair is sometimes only answering the phone before the heroic version of yourself is ready.",
  },
];
