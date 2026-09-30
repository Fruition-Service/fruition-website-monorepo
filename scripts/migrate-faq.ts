import { writeClient } from './sanity-client'

export const FAQ_TABS = [
  {
    _key: 'tab-ps',
    _type: 'faqTab',
    label: 'Professional Services',
    items: [
      {
        _key: 'ps-1',
        _type: 'faqPair',
        question: 'Does monday com have a CRM?',
        answer: 'Yes, monday has a dedicated CRM product. monday.com CRM is a flexible and highly customizable cloud-based CRM platform intended for businesses of all sizes.',
      },
      {
        _key: 'ps-2',
        _type: 'faqPair',
        question: 'Does monday com have task management?',
        answer: 'Yes, monday.com has task management. Take a trial of monday work management and discover just how efficiently you can manage your teams\u2019 to-do list.',
      },
      {
        _key: 'ps-3',
        _type: 'faqPair',
        question: 'Why is monday.com so successful?',
        answer: `Here are key factors that make monday.com so successful:\n\nOne of Monday.com\u2019s key selling points is its highly customizable nature, allowing users to tailor workflows, add automations, and integrate third-party apps.\n\nExtremely user-friendly, making adoption easy\n\nHighly visual, agile, and, most importantly, scalable\n\nmonday.com can be used to manage anything you want. It\u2019s a veritable Swiss Army knife for managers around the world`,
      },
      {
        _key: 'ps-4',
        _type: 'faqPair',
        question: 'What exactly does monday.com do?',
        answer: 'monday.com is the most versatile project management software you\u2019ll find on the market. You can use the platform to manage all of your projects, and also use it as a CRM, to manage your ad campaigns, track bugs, and manage video production.',
      },
    ],
  },
  {
    _key: 'tab-wm',
    _type: 'faqTab',
    label: 'monday Work Management',
    items: [
      {
        _key: 'wm-1',
        _type: 'faqPair',
        question: 'Can monday.com be used for project management?',
        answer: `Yes, monday.com is an excellent project management platform that supports both waterfall and agile methodologies. monday.com Work Management provides comprehensive project portfolio management capabilities, allowing teams to efficiently manage portfolios, projects, and tasks in one centralized workspace.\n\nThe platform offers robust project management features including:\n\nPortfolio management for strategic oversight across multiple projects\n\nAgile project management with sprint planning and kanban boards\n\nWaterfall project management with Gantt charts and timeline views\n\nTask management with customizable workflows and automation\n\nResource management and team collaboration tools\n\nReal-time project tracking and progress reporting\n\nWhether you\u2019re managing a single project or multiple project portfolios, monday.com\u2019s flexible work management platform adapts to your team\u2019s specific project management methodology and workflow requirements.`,
      },
      {
        _key: 'wm-2',
        _type: 'faqPair',
        question: 'What is Monday.com Work Management?',
        answer: 'monday.com Work Management is a cloud-based platform that helps teams plan, organize, and track their work in one centralized workspace. It offers customizable boards, task automation, and powerful integrations to streamline workflows across any industry.',
      },
      {
        _key: 'wm-3',
        _type: 'faqPair',
        question: 'Is monday.com a PPM tool?',
        answer: `Yes, monday.com is a comprehensive Project Portfolio Management (PPM) tool. In October 2024, monday.com launched monday.com Portfolio as part of their Enterprise-level offering, establishing the platform as a robust PPM solution for organizations managing multiple projects and portfolios.\n\nmonday.com Portfolio delivers advanced PPM capabilities including:\n\nMaster template management for standardized project execution across portfolios\n\nCross-board dependencies to manage interconnected projects and deliverables\n\nAutomated portfolio reporting that eliminates manual project status updates\n\nReal-time portfolio visibility with executive dashboards and KPI tracking\n\nResource allocation management across multiple projects and teams\n\nStrategic portfolio alignment with business objectives and priorities\n\nRisk management and portfolio performance analytics\n\nThis Enterprise PPM solution transforms how organizations manage project portfolios by automating reporting workflows, maintaining project interdependencies, and providing strategic oversight. With monday.com Portfolio, project managers and executives can finally say goodbye to manual project updates and embrace data-driven portfolio management at scale.`,
      },
      {
        _key: 'wm-4',
        _type: 'faqPair',
        question: 'Can Monday.com Work Management be customized for my team\u2019s needs?',
        answer: 'Yes! Monday.com is fully customizable. You can build boards, workflows, and dashboards tailored to your team\u2019s unique processes, whether you manage projects, sales pipelines, marketing campaigns, or operations.',
      },
      {
        _key: 'wm-5',
        _type: 'faqPair',
        question: 'Does Monday.com integrate with other tools?',
        answer: 'Absolutely. Monday.com integrates with popular tools like Slack, Microsoft Teams, Google Workspace, Zoom, HubSpot, Salesforce, and more. These integrations ensure seamless data flow and keep your team connected.',
      },
      {
        _key: 'wm-6',
        _type: 'faqPair',
        question: 'How secure is Monday.com Work Management?',
        answer: 'Monday.com uses industry-leading security measures, including SOC 2 Type II compliance, GDPR compliance, data encryption, and role-based permissions. This ensures that your company data remains safe and protected.',
      },
      {
        _key: 'wm-7',
        _type: 'faqPair',
        question: 'What are the five stages of project management?',
        answer: `The five stages of project management form the essential project management lifecycle that guides successful project delivery from start to finish. These project management phases provide a structured framework for managing projects of any size or complexity:\n\n1. Project Initiation\nDefine project scope, objectives, and business case with stakeholder identification\nConduct feasibility analysis and establish project charter with initial resource allocation\n\n2. Project Planning\nDevelop comprehensive project management plans, timelines, and work breakdown structure\nDefine project budget, resource requirements, and risk management strategies\n\n3. Project Execution\nImplement project deliverables according to plan while coordinating team activities\nExecute project tasks and maintain stakeholder communication throughout delivery\n\n4. Project Monitoring and Control\nTrack project progress against planned objectives, timelines, and budget metrics\nImplement change management and conduct regular project status reporting\n\n5. Project Closure\nComplete final project deliverables and obtain stakeholder approval\nConduct project evaluation, document lessons learned, and release project resources\n\nThese five project management stages ensure systematic project delivery, effective resource management, and successful project outcomes while maintaining quality standards and stakeholder satisfaction throughout the project lifecycle.`,
      },
    ],
  },
  {
    _key: 'tab-crm',
    _type: 'faqTab',
    label: 'monday CRM',
    items: [
      {
        _key: 'crm-1',
        _type: 'faqPair',
        question: 'What is monday CRM used for?',
        answer: 'monday CRM allows you to have full control over your sales pipeline, manage your contacts, streamline your post sales processes and sales enablement, all while seeing the big picture at a glance. With monday CRM, you can manage all aspects of your sales cycle and customer data in one central place. Fitted with multiple unique features created just for CRM teams, monday CRM can be used to fit all of your teams\u2019 needs.',
      },
      {
        _key: 'crm-2',
        _type: 'faqPair',
        question: 'Is monday.com a good CRM tool?',
        answer: 'Yes, monday.com can be a great CRM tool, particularly for businesses that value flexibility, customization, and ease of use. Key features that make monday.com a great CRM tool include contact management, pipeline management, automation, and customisation.',
      },
      {
        _key: 'crm-3',
        _type: 'faqPair',
        question: 'Does monday.com CRM provide good value for investment?',
        answer: 'If your priorities include rapid implementation, extensive customization capabilities, and maintaining a unified workspace, then monday CRM delivers excellent value proposition.\n\nDo enterprise-level organizations implement monday.com? Absolutely, numerous Fortune 500 companies utilize monday.com for their operational management requirements. monday.com reports that over 180,000 businesses internationally rely on their platform, including recognized brands like Nissan, Elal, Zippo, Canva, Coca-Cola, Wix, and Uber.',
      },
      {
        _key: 'crm-4',
        _type: 'faqPair',
        question: 'Does monday.com offer complimentary CRM functionality?',
        answer: 'While Monday.com provides specialized CRM packages, these aren\u2019t offered at no cost. Nevertheless, their \u2018Free Forever\u2019 option remains accessible through standard work management subscriptions.',
      },
      {
        _key: 'crm-5',
        _type: 'faqPair',
        question: 'What business functions does monday CRM support?',
        answer: 'monday CRM provides comprehensive oversight of your sales funnel, contact database management, streamlined post-purchase workflows, and sales enablement tools, while delivering executive-level visibility across operations. Through monday CRM, you can coordinate every element of your sales process and customer information within a single unified platform. Equipped with specialized features designed specifically for sales teams, monday CRM adapts to meet all your department\u2019s operational requirements.',
      },
      {
        _key: 'crm-6',
        _type: 'faqPair',
        question: 'How does monday.com compare to Salesforce?',
        answer: 'monday.com and Salesforce serve different market segments with distinct capabilities. Although both platforms provide project management and CRM functionality, they address unique business requirements with separate strengths. Salesforce operates as an enterprise-grade CRM solution ideally designed for large corporations with sophisticated needs, whereas monday.com excels through its intuitive interface, adaptability, and implementation simplicity, positioning it perfectly for SMBs requiring powerful yet expandable solutions.',
      },
      {
        _key: 'crm-7',
        _type: 'faqPair',
        question: 'How does monday.com compare to Hubspot?',
        answer: 'Hubspot is a great tool for Marketing teams, but it lacks in CRM and Project Management capabilities. We have also found from our clients who have switched over to monday.com with our services that they saved on technical administration costs with monday.com due to the cost to develop on Hubspot.',
      },
      {
        _key: 'crm-8',
        _type: 'faqPair',
        question: 'How does monday.com compare to Zoho?',
        answer: 'Zoho is a cheaper CRM alternative, making it great for teams who are looking for a basic CRM that they don\u2019t plan on changing as their business evolves.\n\nAnother key factor that pushed our clients to migrate off of Zoho CRM to monday CRM is due to Zoho\u2019s limited support. Zoho also asks you to pay 20-25% in addition to licenses for support, whereas with monday.com, you can manage the entire system and make changes with some training. monday.com vendor support is available 24/7 and completely free.',
      },
      {
        _key: 'crm-9',
        _type: 'faqPair',
        question: 'How effective is monday.com as a customer relationship management platform?',
        answer: 'monday.com serves as an excellent CRM solution, especially for organizations prioritizing adaptability, customization capabilities, and user-friendly operation. Essential capabilities that establish monday.com as an outstanding CRM platform include contact database management, sales pipeline oversight, workflow automation, and extensive personalization options.\n\nWhat drives monday.com\u2019s widespread adoption? Monday.com\u2019s market success results from its accessible interface design, visual attractiveness, and robust functionality addressing diverse operational management requirements. The platform gains recognition for its adaptability, configurable workflow systems, and seamless integration capabilities with multiple external applications. Additionally, monday.com features an aesthetically pleasing, intuitive architecture that facilitates team collaboration and project oversight.',
      },
      {
        _key: 'crm-10',
        _type: 'faqPair',
        question: 'What are the benefits of using monday.com as a CRM?',
        answer: 'Key benefits include:\n\nCentralized lead and customer data\n\nAutomated task and follow-up management\n\nCustom dashboards for real-time performance tracking\n\nSeamless integrations with popular tools like Gmail, Outlook, Slack, and QuickBooks',
      },
      {
        _key: 'crm-11',
        _type: 'faqPair',
        question: 'Can monday.com integrate with other tools and CRMs?',
        answer: 'Yes, monday.com integrates with email, project management, marketing, and financial tools, including:\n\nGmail & Outlook\n\nSlack & Microsoft Teams\n\nHubSpot, Salesforce, Mailchimp\n\nQuickBooks & Xero\n\nCustom integrations via API or Zapier are also available for unique workflows.',
      },
    ],
  },
  {
    _key: 'tab-ecg',
    _type: 'faqTab',
    label: 'Expert Consultant Guide',
    items: [
      {
        _key: 'ecg-1',
        _type: 'faqPair',
        question: 'What\u2019s the best monday.com CRM implementation strategy?',
        answer: 'When implementing monday.com CRM, we recommend starting with a carefully planned phased rollout guided by certified monday.com consultants.\n\nOur experience shows that successful implementations begin by customizing your CRM setup to match your unique sales processes.\n\nWe typically start by implementing proven sales workflows with powerful automation features, which transforms your entire sales process. The key is scaling the implementation department by department, ensuring each team is comfortable before moving forward.',
      },
      {
        _key: 'ecg-2',
        _type: 'faqPair',
        question: 'How do monday.com Partners handle user adoption?',
        answer: 'The secret to successful user adoption lies in demonstrating immediate wins that matter to your team. As monday.com consultants, we focus on showing tangible improvements in daily workflows.\n\nWe\u2019ve developed change management best practices that ensure smooth transitions, especially when implementing CRM solutions tailored to your existing sales processes.\n\nOur expert-led training programs drive adoption naturally, and we continuously monitor success metrics to adjust our approach as needed.',
      },
      {
        _key: 'ecg-3',
        _type: 'faqPair',
        question: 'What monday.com training do Partners recommend?',
        answer: 'Our training approach combines consultant-led CRM sessions with practical, hands-on learning. We\u2019ve found that custom implementation guides, created specifically for your organization, work best.\n\nWe provide role-specific coaching and support, ensuring everyone from sales reps to administrators gets exactly what they need.\n\nRegular check-in sessions with your dedicated implementation consultant help reinforce learning, and you\u2019ll have full access to our comprehensive Partner knowledge base and resources.',
      },
      {
        _key: 'ecg-4',
        _type: 'faqPair',
        question: 'How do monday.com consultants handle data migration?',
        answer: 'Data migration is a crucial step that requires careful planning and execution. Our Partner team provides expert guidance throughout the CRM data transfer process, using proven templates that ensure data integrity.\n\nWe develop strategic implementation plans that minimize disruption while maximizing efficiency. Our approach includes creating custom workflows that match your sales process, with thorough quality checks at every step to ensure accuracy.',
      },
      {
        _key: 'ecg-5',
        _type: 'faqPair',
        question: 'What success metrics do monday.com Partners track?',
        answer: 'We focus on meaningful metrics that demonstrate real business impact. This includes monitoring CRM adoption rates with detailed Partner guidance, measuring improvements in sales efficiency, and tracking concrete ROI metrics.\n\nOur consultants regularly assess CRM performance and collect customer success stories, helping you understand the tangible benefits of your monday.com implementation. We\u2019ve found that tracking these metrics helps organizations optimize their usage and maximize their return on investment.',
      },
    ],
  },
  {
    _key: 'tab-gq',
    _type: 'faqTab',
    label: 'General Questions',
    items: [
      {
        _key: 'gq-1',
        _type: 'faqPair',
        question: 'Do big companies use monday.com?',
        answer: 'Yes, many large companies use monday.com for their work management needs. monday.com claims that over 180,000 companies globally use the platform, including well-known brands like Nissan, Elal, and Zippo, Canva, Coca-Cola, Wix, and Uber.',
      },
      {
        _key: 'gq-2',
        _type: 'faqPair',
        question: 'Why is monday.com so popular?',
        answer: 'Monday.com\u2019s popularity stems from its user-friendly interface, visual appeal, and powerful features that cater to various work management needs. It\u2019s known for its flexibility, customizable workflows, and ability to integrate with numerous third-party apps. The platform also offers a visually appealing, intuitive design, which makes it easy for teams to collaborate and manage projects.',
      },
      {
        _key: 'gq-3',
        _type: 'faqPair',
        question: 'What companies use monday.com?',
        answer: 'Given monday\u2019s adaptability and comprehensive configuration options, businesses spanning diverse sectors leverage monday.com for project coordination, team collaboration, and numerous operational workflows.\n\nIndustries where our implementation team has delivered successful solutions include marketing agencies, manufacturing enterprises, construction companies, professional service firms, ecommerce businesses, and property management organizations. Notable clients who have deployed monday.com through our consulting services include RayWhite, Landcom, and Government of Western Australia. According to monday.com, more than 180,000 organizations globally depend on their platform.',
      },
    ],
  },
]

async function main() {
  const page = await writeClient.fetch('*[_type == "implementationPackagesPage"][0]{ _id }')
  if (!page) { console.log('No page found'); return }

  await writeClient.patch(page._id).set({ faqTabs: FAQ_TABS }).commit()
  console.log(`Updated FAQ with ${FAQ_TABS.length} tabs:`)
  for (const tab of FAQ_TABS) {
    console.log(`  - ${tab.label}: ${tab.items.length} questions`)
  }
  console.log('Done!')
}

// Only run the write when this file is executed directly, so other scripts can
// safely `import { FAQ_TABS }` as a clean authored source without triggering a
// Sanity write.
if (process.argv[1] && process.argv[1].endsWith('migrate-faq.ts')) {
  main().catch((err) => { console.error(err); process.exit(1) })
}
