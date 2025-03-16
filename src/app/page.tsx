import Card from '@/components/Card';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8">
        <Card title="App about something">
          <p>
            This is a sample application built with Next.js, TypeScript, and Tailwind CSS.
            Feel free to explore and modify the components!
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Features">
            <ul className="list-disc list-inside space-y-2">
              <li>Next.js 14 with App Router</li>
              <li>TypeScript for type safety</li>
              <li>Tailwind CSS for styling</li>
              <li>Responsive design</li>
            </ul>
          </Card>

          <Card title="Getting Started">
            <p className="mb-4">
              Edit <code className="bg-gray-100 rounded px-2 py-1">src/app/page.tsx</code> to
              start customizing your application.
            </p>
            <p>
              Check out the documentation for more information about building with Next.js.
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
