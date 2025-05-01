import { SupabaseConfig } from "@/components/supabase-config"
import { Sidebar } from "@/components/sidebar"
import { SettingsLayout } from "@/components/settings-layout"
import { MockDataGenerator } from "@/components/mock-data-generator"

export default function SupabaseSettingsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          <SettingsLayout>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Supabase Configuration</h2>
                <p className="text-gray-600 mb-6">
                  Connect to your own Supabase instance by providing your project URL and API key.
                </p>
              </div>
              <SupabaseConfig />

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Sample Data</h2>
                <p className="text-gray-600 mb-6">Generate sample data for testing purposes.</p>
                <MockDataGenerator />
              </div>
            </div>
          </SettingsLayout>
        </main>
      </div>
    </div>
  )
}
