import { useState } from "react";
import { actions } from "../../actions";
import CheckIcon from "../../assets/icons/check.svg";
import EditIcon from "../../assets/icons/edit.svg";
import useAxios from "../../hooks/useAxios";
import useProfile from "../../hooks/useProfile";

export default function Bio() {
  const { state, dispatch } = useProfile();
  const { instance } = useAxios();
  const [bio, setBio] = useState(state?.user?.bio);
  const [isEditing, setIsEditing] = useState(false);

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = async () => {
    dispatch({ type: actions.profile.DATA_FETCHING });
    try {
      const response = await instance.patch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/profile/${state?.user?.id}`,
        { bio }
      );
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: actions.profile.USER_DATA_EDITED,
          data: response.data,
        });
      }
      setIsEditing(false);
    } catch (error) {
      dispatch({
        type: actions.profile.DATA_FETCH_ERROR,
        error: error.message,
      });
    }
  };

  if (isEditing) {
    return (
      <div className="mt-4 flex items-start gap-2 lg:mt-6">
        <textarea
          rows="4"
          cols="55"
          className="flex-1 p-2 leading-[188%] rounded-sm text-gray-700"
          value={bio}
          onChange={handleBioChange}
        />
        <button
          onClick={handleSaveClick}
          className="flex-center h-7 w-7 rounded-full"
        >
          <img src={CheckIcon} alt="Save" />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 flex items-start gap-2 lg:mt-6">
      <div className="flex-1">
        <p className="leading-[188%] text-gray-400 lg:text-lg">{bio}</p>
      </div>
      <button
        onClick={handleEditClick}
        className="flex-center h-7 w-7 rounded-full"
      >
        <img src={EditIcon} alt="Edit" />
      </button>
    </div>
  );
}
