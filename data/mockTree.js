export const mockTreeData = [
  {
    id: 1,
    title: 'Personal Notes',
    type: 'folder',
    createdAt: '2025-10-01T10:00:00Z',
    children: [
      {
        id: 2,
        title: 'Daily Journal',
        type: 'note',
        createdAt: '2025-10-02T09:00:00Z',
        content: 'Reflections on the week: Focused on app prototyping, hit a snag with tree mutations but resolved via optimistic updates.'
      },
      {
        id: 3,
        title: 'Project Ideas',
        type: 'folder',
        createdAt: '2025-10-03T14:30:00Z',
        children: [
          {
            id: 4,
            title: 'AI Chat Enhancements',
            type: 'note',
            createdAt: '2025-10-04T11:15:00Z',
            content: 'Integrate RAG for better note querying: Fetch relevant snippets, prompt LLM with context. Mock responses first.'
          },
          {
            id: 5,
            title: 'UI Polish',
            type: 'note',
            createdAt: '2025-10-05T16:45:00Z',
            content: 'shadcn Tree for nav: Add context menu for CRUD. Ensure responsive grid collapses sidebar on mobile.'
          }
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Work Docs',
    type: 'folder',
    createdAt: '2025-10-06T08:20:00Z',
    children: [
      {
        id: 7,
        title: 'Meeting Notes',
        type: 'note',
        createdAt: '2025-10-07T13:10:00Z',
        content: 'Team sync: Discussed Next.js 15 migrations, emphasized server actions for mutations. Action items: Review shadcn integrations.'
      },
      {
        id: 8,
        title: 'API Specs',
        type: 'folder',
        createdAt: '2025-10-08T17:55:00Z',
        children: [
          {
            id: 9,
            title: 'Sequelize Models',
            type: 'note',
            createdAt: '2025-10-09T12:40:00Z',
            content: 'Note model: Self-referential parentId for hierarchy. Enums for type: folder/note. Add indexes on parentId for query perf.'
          }
        ]
      }
    ]
  },
  {
    id: 10,
    title: 'Quick Scratchpad',
    type: 'note',
    createdAt: '2025-10-10T20:30:00Z',
    content: 'Temp ideas: Explore useTransition for smoother tree updates during creates. No children—standalone for fast edits.'
  }
];
