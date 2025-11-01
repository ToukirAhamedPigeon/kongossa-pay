import { useEffect, useState } from "react";
import SettingsLayout from "./SettingsLayout";
import Breadcrumbs from "@/components/dashboard/Breadcumbs";
import HeadingSmall from "@/components/dashboard/HeadingSmall";
import AppearanceTabs from "@/components/dashboard/AppearanceToggleTab";

import { getAppearanceSettings } from "@/api/settings";

export default function Appearance() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  const fetchAppearance = async () => {
    try {
      setLoading(true);
      const data = await getAppearanceSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppearance();
  }, []);

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings" },
    { label: "Appearance" },
  ];

  if (loading) return <p className="text-center py-10 text-muted-foreground">Loading...</p>;

  return (
    <SettingsLayout>
      <div className="space-y-6 mt-10">
        {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}

        <HeadingSmall
          title="Appearance settings"
          description="Update your account's appearance settings"
        />

        {/* Pass settings to your tabs if needed */}
        <AppearanceTabs settings={settings} />
      </div>
    </SettingsLayout>
  );
}
