import FileUploadZone from '@/components/FileUploadZone';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to the Innovation Lab
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your files and select your preferred device.
          </p>
        </div>

        <FileUploadZone />
      </div>
    </main>
  )
}
