import { Auth } from "@supabase/ui";
import type { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { MyPageHeader } from "src/components/MyPageHeader";
import { Avatar } from "src/components/ui/Avatar";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "src/lib/SupabaseClient";
import { useToast } from "src/lib/ToastHooks";

export const Profile: NextPage = () => {
  const { user } = Auth.useUser();
  const [username, setUsername] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [editName, setEditName] = useState<string>(username);
  const [previewIcon, setPreviewIcon] = useState<string>(avatar);
  const [previewIconFile, setPreviewIconFile] = useState<File | null>(null);
  const { errorToast, successToast } = useToast();

  const iconInputRef = useRef<HTMLInputElement | null>(null);

  const fetchProfile = useCallback(async () => {
    if (user) {
      const profile = await getProfile(user.id);
      if (profile) {
        setUsername(profile.username);
        setEditName(profile.username);
        setAvatar(profile.avatar);
        setPreviewIcon(profile.avatar);
      }
    }
  }, [user]);

  const handleChangePreviewIcon = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) {
        return;
      }
      setPreviewIconFile(e.target.files[0]);
      setPreviewIcon(URL.createObjectURL(e.target.files[0]));
      e.currentTarget.value = "";
    },
    []
  );

  const handleClickChangeIcon = useCallback(() => {
    if (!iconInputRef || !iconInputRef.current) {
      return;
    }
    iconInputRef.current.click();
  }, []);

  const handleSave = useCallback(async () => {
    if (user) {
      if (editName == "") {
        errorToast("名前を入力してください。");
        return;
      }
      let isIconChanged = false;
      if (previewIconFile) {
        const isOk = await uploadAvatar(user.id, previewIconFile);
        if (!isOk) {
          errorToast("アイコンのアップロードに失敗しました。");
          return;
        }
        isIconChanged = true;
      }
      const isOkUpdate = await updateProfile(
        user.id,
        editName,
        isIconChanged ? "storage" : avatar
      );
      if (!isOkUpdate) {
        errorToast("プロフィールの更新に失敗しました。");
      } else {
        fetchProfile();
        successToast("プロフィールを更新しました。");
      }
    }
  }, [
    user,
    editName,
    previewIconFile,
    avatar,
    errorToast,
    fetchProfile,
    successToast,
  ]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  return (
    <>
      <MyPageHeader name="プロフィール" />
      <div className=" flex flex-col items-center">
        <div className="m-auto w-2/3 max-w-2xl">
          <span className="text-sm text-[#C2C6D2]">アイコン</span>
          <div className="flex items-center mt-2 mb-4">
            <Avatar image={previewIcon} size="large" isRounded={false} />
            <div className="ml-4">
              <input
                className="hidden"
                type="file"
                accept="image/jpeg"
                ref={iconInputRef}
                onChange={handleChangePreviewIcon}
              />
              <button
                className="block py-3 px-4 text-xs font-bold text-[#070417] bg-[#F1F5F9] dark:bg-gray-300 rounded-2xl hover:opacity-70"
                onClick={handleClickChangeIcon}
              >
                変更する
              </button>
            </div>
          </div>
          <span className="text-xs text-[#C2C6D2]">名前</span>
          <div className="grid gap-8 ">
            <div className="mt-2 w-full">
              <input
                type="text"
                size={66}
                className="py-3 px-4 w-full text-sm font-thin text-[#070417] bg-[#F1F5F9] dark:bg-gray-300 rounded-3xl"
                placeholder="ユーザー名"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <button
              className="py-4 w-full text-sm font-bold text-white bg-[#3B82F6] dark:bg-blue-400 rounded-3xl hover:opacity-70"
              onClick={handleSave}
            >
              保存する
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
