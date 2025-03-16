import Layout from '@/components/Layout';
import DataList from '@/components/DataList';

export default function Home() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Real-Time Data Manager</h1>
          <p className="text-gray-600 mt-2">
            Add, edit, and organize your data in real-time across all your devices
          </p>
        </div>
        
        <DataList />
      </div>
    </Layout>
  );
}
