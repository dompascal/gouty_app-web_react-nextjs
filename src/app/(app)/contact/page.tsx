import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          Contact Us
        </h1>
        <p className="text-lg text-muted-foreground">
          We'd love to hear from you.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            If you have any questions, feedback, or inquiries, please don't hesitate to reach out.
          </p>
          <p>
            You can email us at: <a href="mailto:support@gouty.app" className="text-primary underline">support@gouty.app</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
