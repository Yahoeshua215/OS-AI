import { Sidebar } from "@/components/sidebar"

export default function MessagesPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MessageCard
                title="Push Notifications"
                description="Send notifications to your users' devices"
                href="/push"
              />
              <MessageCard title="In-App Messages" description="Display messages within your app" href="/in-app" />
              <MessageCard title="Email" description="Send emails to your users" href="/email" />
              <MessageCard title="SMS" description="Send text messages to your users" href="/sms" />
              <MessageCard title="Templates" description="Create reusable message templates" href="/templates" />
              <MessageCard title="Automated" description="Set up automated messaging workflows" href="/automated" />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

interface MessageCardProps {
  title: string
  description: string
  href: string
}

function MessageCard({ title, description, href }: MessageCardProps) {
  return (
    <a href={href} className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50">
      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">{title}</h5>
      <p className="font-normal text-gray-700">{description}</p>
    </a>
  )
}
