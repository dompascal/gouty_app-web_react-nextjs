import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-lg text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Welcome to Gouty. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We may collect personal information from you, such as your name and email address, when you register for an account. We also collect data you voluntarily provide, such as your food diary entries.
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Use of Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Having accurate information permits us to offer you a smooth, efficient, and customized experience. Specifically, we may use information collected about you to create and manage your account, and to personalize your experience.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
