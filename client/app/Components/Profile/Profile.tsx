import { useUserContext } from "@/context/userContext";
import { logout } from "@/utils/Icons";
import { gradientText } from "@/utils/TaiwindStyles";
import Image from "next/image";
import React, { useState } from "react";

function Profile() {
  const { updateUser, changePassword, logoutUser } = useUserContext();

  const photo = useUserContext().user?.photo;
  const bio = useUserContext().user?.bio;
  const name = useUserContext().user?.name;

  const [localBio, setLocalBio] = useState(bio);
  const [localName, setLocalName] = useState(name);
  const [localOldPassword, setLocalOldPassword] = useState("");
  const [localNewPassword, setLocalNewPassword] = useState("");

  const handleInput = (name: string) => (e: any) => {
    switch (name) {
      case "name":
        setLocalName(e.target.value);
        break;
      case "bio":
        setLocalBio(e.target.value);
        break;
      case "oldPassword":
        setLocalOldPassword(e.target.value);
        break;
      case "newPassword":
        setLocalNewPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="px-4 pb-8 w-[90%]">
      <h3
        className={`pt-6 pb-8 flex justify-center text-3xl font-black ${gradientText} dark:text-white`}
      >
        My Profile
      </h3>

      <div className="flex flex-col">
        <div className="group relative self-center">
          <Image
            src={photo}
            alt="profile"
            width={300}
            height={300}
            className="aspect-square rounded-full object-cover border-2 border-[white] cursor-pointer hover:scale-105 transition-transform
            duration-300 ease-in-out shadow-sm select-text  dark:border-[#3C3C3C]/65"
          />

          <input
            type="file"
            name="file"
            id="file"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />

          <span className="absolute top-0 w-full h-full rounded-full cursor-pointer flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none">
            Change Image
          </span>
        </div>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            updateUser({ name: localName, bio: localBio });
          }}
        >
          <div className="mb-2">
            <label
              htmlFor="name"
              className={`text-lg font-semibold ${gradientText} dark:text-slate-200`}
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={localName}
              onChange={handleInput("name")}
              className="w-full pl-4 p-2 rounded-md bg-blue-100 shadow-sm border-2 border-[white] focus:outline-none focus:ring-2 focus:ring-[#7263f3] focus:border-transparent
             dark:bg-[#3C3C3C]/65 dark:border-[#3C3C3C]/65"
            />
          </div>
          <div>
            <label
              htmlFor="bio"
              className={`text-lg font-semibold ${gradientText} dark:text-slate-200`}
            >
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={3}
              defaultValue={localBio}
              onChange={handleInput("bio")}
              className="w-full pl-4 p-2 rounded-md bg-blue-100 dark:bg-[#3C3C3C]/65 resize-none
              dark:border-[#3C3C3C]/65 shadow-sm border-2 border-[white] focus:outline-none focus:ring-2 focus:ring-[#7263f3] focus:border-transparent"
            ></textarea>
          </div>

          <div className="py-4 flex justify-end">
            <button
              type="submit"
              className="bg-[#7263f3] text-white p-2 rounded-md hover:bg-[#f56693] transition-colors duration-300 ease-in-out"
            >
              Update Profile
            </button>
          </div>
        </form>

        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            changePassword(localOldPassword, localNewPassword);
            setLocalOldPassword("");
            setLocalNewPassword("");
          }}
        >
          <div className="flex gap-2">
            <div>
              <label
                htmlFor="oldPassword"
                className={`text-lg font-semibold ${gradientText} dark:text-slate-200`}
              >
                Old Password
              </label>
              <input
                type="password"
                name="oldPassword"
                id="oldPassword"
                value={localOldPassword}
                onChange={handleInput("oldPassword")}
                className="w-full pl-4 p-2 rounded-md bg-blue-100 shadow-sm border-2 border-[white] focus:outline-none focus:ring-2 focus:ring-[#7263f3] focus:border-transparent
              dark:bg-[#3C3C3C]/65 dark:border-[#3C3C3C]/65"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className={`text-lg font-semibold ${gradientText} dark:text-slate-200`}
              >
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={localNewPassword}
                onChange={handleInput("newPassword")}
                className="w-full pl-4 p-2 rounded-md bg-blue-100 shadow-sm border-2 border-[white] focus:outline-none focus:ring-2 focus:ring-[#7263f3] focus:border-transparent
              dark:bg-[#3C3C3C]/65 dark:border-[#3C3C3C]/65"
              />
            </div>
          </div>
          <div className="py-4 flex justify-end">
            <button className="bg-[#7263f3] text-white p-2 rounded-md hover:bg-[#f56693] transition-colors duration-300 ease-in-out">
              Update Password
            </button>
          </div>
        </form>

        <div className="pt-4 self-center">
          <button
            onClick={() => logoutUser()}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 ease-in-out"
          >
            {logout} Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
