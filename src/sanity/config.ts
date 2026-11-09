import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { deskStructure } from './structure'

const SINGLETON_TYPES = new Set([
  'siteSettings',
  'homePage',
  'implementationPackagesPage',
  'licensingPage',
  'mondayTrainingPage',
  'mondayImplementationConsultantsPage',
  'makePartnersPage',
])

export default defineConfig({
  name: 'fruition-landing',
  title: 'Fruition',
  projectId: 'bt6nb58h',
  dataset: 'production',
  plugins: [structureTool({ structure: deskStructure }), visionTool()],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((tpl) => !SINGLETON_TYPES.has(tpl.templateId)),
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter((a) => !['duplicate', 'delete', 'unpublish'].includes(a.action ?? ''))
        : prev,
  },
})
