import type { StructureBuilder } from 'sanity/structure'
import {
  Settings,
  FileText,
  Home,
  Package,
  GraduationCap,
  Hammer,
  Link2,
  Files,
  Building2,
  Lightbulb,
  Handshake,
  Brain,
  Globe,
  Bell,
  Users,
  Star,
  HelpCircle,
  ReceiptText,
} from 'lucide-react'

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // ── Site Settings (singleton) ───────────────────────────────
      S.listItem()
        .title('Site Settings')
        .icon(Settings)
        .child(
          S.editor()
            .id('siteSettings')
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      S.divider(),

      // ── Pages ───────────────────────────────────────────────────
      S.listItem()
        .title('Pages')
        .icon(FileText)
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Home Page')
                .icon(Home)
                .child(
                  S.editor()
                    .id('homePage')
                    .schemaType('homePage')
                    .documentId('homePage')
                ),
              S.listItem()
                .title('Implementation Packages')
                .icon(Package)
                .child(
                  S.editor()
                    .id('implementationPackagesPage')
                    .schemaType('implementationPackagesPage')
                    .documentId('implementationPackagesPage')
                ),
              S.listItem()
                .title('Monday Training')
                .icon(GraduationCap)
                .child(
                  S.editor()
                    .id('mondayTrainingPage')
                    .schemaType('mondayTrainingPage')
                    .documentId('mondayTrainingPage')
                ),
              S.listItem()
                .title('Monday Implementation Consultants')
                .icon(Hammer)
                .child(
                  S.editor()
                    .id('mondayImplementationConsultantsPage')
                    .schemaType('mondayImplementationConsultantsPage')
                    .documentId('mondayImplementationConsultantsPage')
                ),
              S.listItem()
                .title('Make Partners')
                .icon(Link2)
                .child(
                  S.editor()
                    .id('makePartnersPage')
                    .schemaType('makePartnersPage')
                    .documentId('makePartnersPage')
                ),
              S.listItem()
                .title('Licensing & Procurement (/pricing)')
                .icon(ReceiptText)
                .child(
                  S.editor()
                    .id('licensingPage')
                    .schemaType('licensingPage')
                    .documentId('licensingPage')
                ),
              S.divider(),
              S.listItem()
                .title('General Pages')
                .icon(Files)
                .child(
                  S.documentTypeList('page')
                    .title('General Pages')
                    .defaultOrdering([{ field: 'title', direction: 'asc' }])
                ),
            ])
        ),

      S.divider(),

      // ── Industry Pages ──────────────────────────────────────────
      S.listItem()
        .title('Industries')
        .icon(Building2)
        .child(
          S.documentTypeList('industryPage')
            .title('Industry Pages')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      // ── Solution Pages ──────────────────────────────────────────
      S.listItem()
        .title('Solutions')
        .icon(Lightbulb)
        .child(
          S.documentTypeList('solutionPage')
            .title('Solution Pages')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      // ── Partnership Pages ───────────────────────────────────────
      S.listItem()
        .title('Partnerships')
        .icon(Handshake)
        .child(
          S.documentTypeList('partnershipPage')
            .title('Partnership Pages')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      // ── AI Partner Pages ────────────────────────────────────────
      S.listItem()
        .title('Partnerships (AI)')
        .icon(Brain)
        .child(
          S.documentTypeList('aiPartnerPage')
            .title('AI Partner Pages')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      // ── Location Pages ──────────────────────────────────────────
      S.listItem()
        .title('Locations')
        .icon(Globe)
        .child(
          S.documentTypeList('locationPage')
            .title('Location Pages')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      // ── Service Pages ───────────────────────────────────────────
      S.listItem()
        .title('Services')
        .icon(Bell)
        .child(
          S.documentTypeList('servicePage')
            .title('Service Pages')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      S.divider(),

      // ── Blog ────────────────────────────────────────────────────
      S.listItem()
        .title('Blog')
        .icon(FileText)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('Posts')
                .child(
                  S.documentTypeList('blogPost')
                    .title('Blog Posts')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Categories')
                .child(
                  S.documentTypeList('blogCategory')
                    .title('Blog Categories')
                    .defaultOrdering([{ field: 'title', direction: 'asc' }])
                ),
            ])
        ),

      S.divider(),

      // ── Content Library ─────────────────────────────────────────
      S.listItem()
        .title('Team Members')
        .icon(Users)
        .child(
          S.documentTypeList('teamMember')
            .title('Team Members')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),

      S.listItem()
        .title('Case Studies')
        .icon(Star)
        .child(
          S.documentTypeList('caseStudy')
            .title('Case Studies')
            .defaultOrdering([{ field: 'clientCompany', direction: 'asc' }])
        ),

      S.listItem()
        .title('FAQ Items')
        .icon(HelpCircle)
        .child(
          S.documentTypeList('faqItem')
            .title('FAQ Items')
            .defaultOrdering([{ field: 'question', direction: 'asc' }])
        ),
    ])
