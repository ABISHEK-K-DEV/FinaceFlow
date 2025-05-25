
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Mail, MessageSquare } from 'lucide-react';
import Image from 'next/image';

export default function HelpPage() {
  return (
    <>
      <PageHeader
        title="Help & Support"
        description="Find answers to your questions or get in touch with us."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-primary" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Quick answers to common questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>How do I add a new transaction?</li>
              <li>Can I set recurring budgets?</li>
              <li>How is my data secured?</li>
              <li>Where can I change my password?</li>
            </ul>
            <Image src="https://placehold.co/400x200.png" alt="FAQ Illustration" width={400} height={200} className="mt-4 rounded-md" data-ai-hint="faq help"/>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5 text-primary" />
              Email Support
            </CardTitle>
            <CardDescription>Send us an email for assistance.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              If you need further help, please email us at:
            </p>
            <a href="mailto:support@financeflow.app" className="text-primary hover:underline font-medium">
              support@financeflow.app
            </a>
            <p className="text-xs text-muted-foreground mt-2">
              We typically respond within 24-48 hours.
            </p>
             <Image src="https://placehold.co/400x200.png" alt="Email Support" width={400} height={200} className="mt-4 rounded-md" data-ai-hint="email contact"/>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" />
              Community Forum
            </CardTitle>
            <CardDescription>Ask questions and share tips with other users.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              (Coming Soon) Join our community forum to connect with other FinanceFlow users.
            </p>
             <Image src="https://placehold.co/400x200.png" alt="Community Forum" width={400} height={200} className="mt-4 rounded-md" data-ai-hint="community forum"/>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
