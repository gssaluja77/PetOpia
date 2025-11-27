import SignOutButton from "./SignOut";

function Account() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Account Settings
        </h2>
        <div className="flex justify-center">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}

export default Account;
