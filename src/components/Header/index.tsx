import { Popover } from "@headlessui/react";
import { Auth, IconSettings } from "@supabase/ui";
// import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { Avatar } from "src/components/ui/Avatar";
import { addNewProfile, client, getProfile } from "src/lib/SupabaseClient";
// import { useToast } from "src/lib/ToastHooks";

export const Header = () => {
  const { user } = Auth.useUser();
  // const { errorToast } = useToast();
  const [avatar, setAvatar] = useState<string>("");
  const router = useRouter();

  const fetchProfile = useCallback(
    async (uid: string) => {
      if (user) {
        const profile = await getProfile(user.id);
        if (profile) {
          setAvatar(profile.avatar);
        } else {
          const username = user.user_metadata.name
            ? user.user_metadata.name
            : "ユーザー";
          const avatar_url = user.user_metadata.avatar_url
            ? user.user_metadata.avatar_url
            : "";
          const isOk = await addNewProfile(uid, username, avatar_url);
          if (!isOk) {
            // errorToast("プロフィールの新規登録に失敗しました。");
          } else {
            setAvatar(avatar_url);
          }
        }
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  const handleSetting = useCallback(() => {
    router.push("/mypage");
  }, [router]);

  const handleLogout = useCallback(() => {
    client.auth.signOut();
  }, []);

  return (
    <header>
      <div className="flex justify-around items-center p-5 dark:bg-[#353e49]">
        <Link href="/" passHref>
          <a></a>
        </Link>
        {user ? (
          <Popover className="relative text-center sm:w-80">
            <Popover.Button>
              <Avatar image={avatar} size="small" isRounded={true} />
            </Popover.Button>

            <Popover.Panel className="flex overflow-hidden absolute right-0 z-10 flex-col py-3 mt-2 w-40 bg-white rounded-3xl drop-shadow-xl sm:w-80">
              <Popover.Button>
                <div
                  onClick={handleSetting}
                  className="flex gap-2 items-center py-2 px-5 w-full h-10 text-sm font-bold dark:text-slate-800 hover:bg-slate-100"
                >
                  <IconSettings size={19} />
                  <p>設定</p>
                </div>
              </Popover.Button>
              <Popover.Button>
                <div
                  className="flex gap-2 items-center py-2 px-5 w-full h-10 text-sm font-bold text-red-400 hover:bg-slate-100"
                  onClick={handleLogout}
                >
                  <HiOutlineLogout size={20} />
                  <p>ログアウト</p>
                </div>
              </Popover.Button>
            </Popover.Panel>
          </Popover>
        ) : (
          <div className="w-10 h-10"></div>
        )}
      </div>
    </header>
  );
};
