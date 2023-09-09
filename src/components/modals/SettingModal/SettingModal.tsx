import { useState } from "react";
import { useUsers } from "../../../hooks";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "../../../state";
import { IKImage } from "imagekitio-react";

export const SettingModal = () => {
  const [fullNameError, setFullNameError] = useState<null | string>(null);
  const [profileError, setProfileError] = useState<null | string>(null);
  const currentUserState = useAtomValue(currentUserAtom);

  const { updateCurrentUserInfo } = useUsers();

  const onFullNameSave: React.FocusEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const fullName = e.target.value;
    try {
      setFullNameError(null);
      if (!fullName) return;
      if (fullName.length <= 0) return;
      if (fullName.length > 0 && fullName.length < 3)
        throw new Error("full name must be 3 character and more");
      await updateCurrentUserInfo({ fullName: fullName });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setFullNameError(error.message);
      console.log(error);
    }
  };

  const onProfileUploadAndSave: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    try {
      setProfileError(null);
      if (!e.target.files) return;
      if (e.target.files.length <= 0) return;
      const fileToUpload = e.target.files[0];
      await updateCurrentUserInfo({ profileImage: fileToUpload });
      const profileImageRef = document.getElementById(
        "profile-image-ref"
      ) as HTMLInputElement;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      profileImageRef.value = null;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setProfileError(error.message);
      console.log(error);
    }
  };

  return (
    <>
      <dialog id="SettingModal" className="daisy-modal">
        <form method="dialog" className="daisy-modal-box">
          <button className="daisy-btn daisy-btn-sm daisy-btn-circle daisy-btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <div className="gap-2 flex flex-col">
            <div>
              <label htmlFor="" className="flex flex-col gap-4">
                <div className="">
                  {currentUserState?.profileImage ? (
                    <IKImage
                      path={currentUserState?.profileImage.filePath}
                      className="w-1/2 daisy-rounded"
                      loading="lazy"
                    />
                  ) : (
                    <img
                      className="w-1/2 daisy-rounded"
                      src="https://dummyimage.com/1000x1000/000/fff"
                      alt=""
                    />
                  )}
                </div>
                <input
                  onChange={onProfileUploadAndSave}
                  id="profile-image-ref"
                  type="file"
                  className="daisy-file-input daisy-file-input-bordered daisy-file-input-sm w-full"
                />
              </label>
              {profileError && (
                <span className="text-error text-sm">{profileError}</span>
              )}
            </div>
            {/* fullName */}
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">Full Name</span>
                <input
                  onBlur={onFullNameSave}
                  defaultValue={currentUserState?.fullName || ""}
                  type="text"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                />
              </label>
              {fullNameError && (
                <span className="text-error text-sm">{fullNameError}</span>
              )}
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">Email</span>
                <input
                  disabled
                  defaultValue={currentUserState?.email}
                  type="text"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                />
              </label>
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">Current password</span>
                <input
                  type="text"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                />
              </label>
              {/* <span className="text-error text-sm">Error</span> */}
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">New password</span>
                <input
                  type="text"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                />
              </label>
              {/* <span className="text-error text-sm">Error</span> */}
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">
                  Re-type new password
                </span>
                <input
                  type="text"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                />
              </label>
              {/* <span className="text-error text-sm">Error</span> */}
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button className="daisy-btn daisy-btn-sm daisy-btn-neutral">
                Update password
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};
