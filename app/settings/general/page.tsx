import { Sidebar } from "@/components/sidebar"
import { SettingsLayout } from "@/components/settings-layout"

export default function GeneralSettingsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          <SettingsLayout>
            <div>
              <h2 className="text-xl font-semibold mb-6">General Settings</h2>
              <p className="text-gray-600 mb-6">Configure general settings for your OneSignal account.</p>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">General settings content will appear here.</p>
              </div>
            </div>
          </SettingsLayout>
        </main>
      </div>
    </div>
  )
}
