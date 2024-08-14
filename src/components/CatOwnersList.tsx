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


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="p-4 bg-slate-900 font-mono">
      <h1 className="text-2xl font-bold mb-4">Cat Owner List</h1>

      <InfiniteScroll
        dataLength={paginatedData?.pages.flatMap(page => page.data).length || 0}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<h4>Loading more...</h4>}
        endMessage={<p>No more data</p>}
      >
        <ul className="space-y-4">
          {paginatedData?.pages.flatMap(page => page.data).map((owner, index) => (
            <li key={index} className="flex items-center space-x-4 border p-4 rounded-lg shadow">
              <img src={owner.ownerPicture} alt="Owner" className="w-16 h-16 rounded-full" />
              <div>
                <p className="text-xl font-semibold">{owner.ownerName}</p>
                <p className="text-gray-600">{owner.catFact}</p>
              </div>
            </li>
          ))}
        </ul>
      </InfiniteScroll>

    </div>
  );
};

export default CatOwnersList;
