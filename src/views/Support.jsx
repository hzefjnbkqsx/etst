'use client';

import { useState } from 'react';
import PageLayout from '@/components/shared/PageLayout';
import SectionHeading from '@/components/shared/SectionHeading';
import GlassCard from '@/components/shared/GlassCard';
import { Button } from '@/components/ui/button';
import { MessageSquare, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '@/hooks/use-settings';

export default function Support() {
  const [copied, setCopied] = useState(false);
  const { data: settings } = useSettings();
  const discordInviteUrl = settings.discord_invite_url;
  const serverIp = settings.server_ip;

  const copyServerIp = async () => {
    await navigator.clipboard.writeText(serverIp);
    setCopied(true);
    toast.success('Server IP copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout>
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            title="Support Center"
            subtitle="Need help? Join our Discord support server or copy the server IP"
          />

          <GlassCard hover={false} className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Get Help on Discord</h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
              Our staff handles support through Discord so you can get faster help from the team and community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={discordInviteUrl || undefined} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button disabled={!discordInviteUrl} className="bg-primary hover:bg-primary/90 glow-purple w-full sm:w-auto">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Join Discord Support
                </Button>
              </a>
              <Button variant="outline" onClick={copyServerIp} className="w-full sm:w-auto">
                {copied ? <Check className="w-4 h-4 mr-2 text-green-400" /> : <Copy className="w-4 h-4 mr-2" />}
                Copy Server IP
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>
    </PageLayout>
  );
}
