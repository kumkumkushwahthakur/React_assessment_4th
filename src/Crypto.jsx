import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function Crypto() {
  const queryClient = useQueryClient();

  const [favorites, setFavorites] = useState([]);

  async function getCrypto() {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return response.json();
  }

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["data"],
    queryFn: getCrypto,
    refetchInterval: 10000,
  });

  async function postCrypto(coin) {
    setFavorites([...favorites, coin]);
    return coin;
  }

  const mutation = useMutation({
    mutationFn: postCrypto,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },

    onError: (error) => {
      console.log(error.message);
    },
  });

  if (isPending) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <>
      <h2>Bitcoin: ${data.bitcoin.usd}</h2>
      <button onClick={() => mutation.mutate("bitcoin")}>
        Add to Favorites
      </button>

      <h2>Ethereum: ${data.ethereum.usd}</h2>
      <button onClick={() => mutation.mutate("ethereum")}>
        Add to Favorites
      </button>

      <h2>Dogecoin: ${data.dogecoin.usd}</h2>
      <button onClick={() => mutation.mutate("dogecoin")}>
        Add to Favorites
      </button>
    </>
  );
}

export default Crypto;