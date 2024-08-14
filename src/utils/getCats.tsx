import axios from "axios";

interface Cat {
    fact: string;
}

interface CatApiResponse {
  current_page: number;
  data: Cat[];
  last_page: number;
}

export const getCats = async (pageNum: number | undefined): Promise<CatApiResponse> => {

    const url: string | undefined = process.env.REACT_APP_CATS_URL;
    if (!url) {
      throw new Error("Cats url API not defined");
    }
  
    const { data } = await axios.get(`${url}?page=${pageNum}`)
    
    // return data.data.map((e: any) => e.fact);
    return data
}
