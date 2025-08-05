export default function Page() {
  return (
    <div className="flex h-dvh w-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Registration Disabled</h1>
        <p className="text-gray-600 mb-4">
          Registration is currently disabled for this deployment.
        </p>
        <a 
          href="/chat" 
          className="text-blue-600 hover:underline"
        >
          Go to Chat
        </a>
      </div>
    </div>
  );
}
