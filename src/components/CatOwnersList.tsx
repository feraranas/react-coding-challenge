import { getCats } from '../utils/getCats';
import { getUsers } from '../utils/getUsers';
import { useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';

interface CatOwner {
  catFact: string;
  ownerName: string;
  ownerPicture: string;
}

const fetchCatOwners = async (pageParam = 1): Promise<{ data: CatOwner[], nextPage: number | undefined }> => {
  try {
    const catResponse = await getCats(pageParam);
    const catOwners: CatOwner[] = await Promise.all(
      catResponse.data.map(async (cat) => {
        const user = await getUsers();
        return {
          catFact: cat.fact,
          ownerName: `${user.title} ${user.first} ${user.last}`,
          ownerPicture: user.picture,
        };
      })
    );

    return {
      data: catOwners,
      nextPage: catResponse.current_page < catResponse.last_page ? pageParam + 1 : undefined,
    };
  } catch (error) {
    console.error("Error fetching cat owners:", error);
    throw error;
  }
};

const CatOwnersList = () => {
  const {
    data: paginatedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['catOwners'],
    queryFn: ({ pageParam }) => fetchCatOwners(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });


  if (isLoading) return <div className="fixed top-0 left-0 right-0 bottom-0 bg-slate-950 flex items-center justify-center font-mono text-white">
                  Loading...
                </div>

  if (error) return <div className="fixed top-0 left-0 right-0 bottom-0 bg-slate-950 flex items-center justify-center font-mono text-white">
                  Loading...
                </div>


  return (
    <div className="items-center p-4 bg-slate-950 font-mono">
      <div className="flex justify-center ">
        <h1 className="text-4xl items-center font-bold text-gray-400 mb-4">😻</h1>
        <div className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800">+99</div>
      </div>

      <InfiniteScroll
        dataLength={paginatedData?.pages.flatMap(page => page.data).length || 0}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<h4 className='m-auto p-5 text-center text-slate-200 text-2xl p-10 w-full bg-slate-500 rounded-lg'>Loading more cat lovers...</h4>}
        endMessage={<p>No more data</p>}
      >
        <ul className="space-y-4">
          {paginatedData?.pages.flatMap(page => page.data).map((owner, index) => (
            <li key={index} 
                className="flex items-center m-auto space-x-4 w-3/5 border-2 border-neutral-900 p-4 rounded-lg shadow bg-slate-800 hover:bg-gray-900">
              <img src={owner.ownerPicture} alt="Owner" className="w-16 h-16 border-2  border-neutral-800 rounded-3xl " />
              <div>
                <p className="text-xl font-semibold text-slate-400">{owner.ownerName}</p>
                <p className="text-slate-500 font-light">{owner.catFact}</p>
              </div>
            </li>
          ))}
        </ul>
      </InfiniteScroll>

    </div>
  );
};

export default CatOwnersList;
