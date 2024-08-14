import axios from "axios";

interface CatOwner {
    id: string;
    picture: string;
    title: string;
    first: string;
    last: string;
}

export const getUsers = async (): Promise<CatOwner> => {
    const url: string | undefined = process.env.REACT_APP_USERS_URL;
    if (!url) {
      throw new Error("Users url API not defined");
    }
    const { data } = await axios.get(url);
    const user = data.results[0];
  
    return {
        id: user.login.uuid,
        picture: user.picture.medium,
        title: user.name.title,
        first: user.name.first,
        last: user.name.last
    };
}