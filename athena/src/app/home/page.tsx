import { currentUser } from "@clerk/nextjs/server";
import { UploadForm } from "@/(components)/UploadForm";

export default async function Home() {
  const user = await currentUser();


  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-xl lg:text-4xl m-5">
        Welcome to the Home Page, {user?.firstName}!
      </h1>
      <UploadForm />
    </div>
  );
}
