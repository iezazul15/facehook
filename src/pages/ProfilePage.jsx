import { useEffect } from "react";
import { actions } from "../actions";
import MyPosts from "../components/profile/MyPosts";
import ProfileInfo from "../components/profile/ProfileInfo";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import useProfile from "../hooks/useProfile";

export default function ProfilePage() {
  const { instance } = useAxios();
  const {
    auth: { user },
  } = useAuth();
  const { state, dispatch } = useProfile();

  useEffect(() => {
    dispatch({ type: actions.profile.DATA_FETCHING });
    const fetchProfileData = async () => {
      try {
        const response = await instance.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/profile/${user.id}`
        );
        if (response.status === 200) {
          dispatch({
            type: actions.profile.DATA_FETCHED,
            data: response.data,
          });
        }
      } catch (error) {
        dispatch({
          type: actions.profile.DATA_FETCH_ERROR,
          error: error.message,
        });
      }
    };
    fetchProfileData();
  }, []);

  if (state?.loading) {
    return <div> Fetching your Profile data...</div>;
  }

  return (
    <main className="mx-auto max-w-[1020px] py-8">
      <div className="container">
        <ProfileInfo />

        <h4 className="mt-6 text-xl lg:mt-8 lg:text-2xl">Your Posts</h4>
        <MyPosts />
      </div>
    </main>
  );
}
