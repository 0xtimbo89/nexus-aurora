import {
  VStack,
  Image,
  HStack,
  Text,
  Box,
  SimpleGrid,
  Button,
  Spinner,
} from "@chakra-ui/react";
import styles from "@styles/Collection.module.css";
import ImageContainer from "@components/ImageContainer";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { fetchAssets } from "@utils/web3";
import { useTron } from "@components/TronProvider";

function getCoverImage(address) {
  switch (address) {
    case "TJPq4YNHnDidiEUm7woN6vsLXhdLUVT4bZ":
      return "/journey.jpg";
    case "TFYZNWX1vkv3wovsLcEkQMLeQBYfPMs2Ap":
      return "/slenderman.jpg";
    case "TCbQV7iV7gTAXsLdVSxMruLzzWPffZPj4Y":
      return "/pokemon.jpg";
    case "TJXL51C7YCNstnepHHW6cKo6RU4ebCwEZk":
      return "/cover.jpg";
    case "TVjHb2Sj5qA5kLEoNUJDksfZ1P2FXy7rNs":
      return "/nexus.jpg";
    default:
      return "/cover.png";
  }
}

function Collection() {
  const router = useRouter();
  const { provider } = useTron();
  const { id: collectionAddress } = router.query;
  const [isLoading, setLoading] = useState(false);
  const [numAssets, setNumAssets] = useState(0);
  const [collMetadata, setCollMetadata] = useState<any>();
  const [tokenMetadata, setTokenMetadata] = useState<any[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);

  const fetchCollectionURI = useCallback(async () => {
    setLoading(true);
    if (!collectionAddress) return;
    try {
      const nftContract = await provider.contract().at(collectionAddress);
      const collectionURI = await nftContract["getCollectionURI"]().call();

      const response = await fetch(collectionURI);
      const result = await response.json();

      setCollMetadata(result);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }, [collectionAddress]);

  const fetchNumAssets = useCallback(async () => {
    setLoading(true);
    if (!collectionAddress) return;
    try {
      const nftContract = await provider.contract().at(collectionAddress);
      const lastTokenId = await nftContract["getLastTokenId"]().call();

      setNumAssets(lastTokenId.toNumber());
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }, [collectionAddress]);

  const fetchTokenInfo = useCallback(async () => {
    if (!collectionAddress || numAssets === 0) return;

    try {
      const { assets } = await fetchAssets();
      const filteredAssets = assets
        .filter((asset) => asset.address === collectionAddress)
        .sort((a, b) => a.tokenId - b.tokenId);
      setTokenMetadata(filteredAssets);
    } catch (e) {
      console.log(e);
    }
  }, [numAssets, collectionAddress]);

  useEffect(() => {
    if (!collMetadata) {
      fetchCollectionURI();
    }
    if (!numAssets) {
      fetchNumAssets();
    }
    if (numAssets) {
      fetchTokenInfo();
    }
  }, [fetchNumAssets, fetchCollectionURI, fetchTokenInfo, numAssets]);

  if (!collectionAddress || !collMetadata || tokenMetadata.length === 0)
    return (
      <VStack className={styles.main}>
        <Spinner />
      </VStack>
    );

  return (
    <VStack className={styles.main}>
      <VStack className={styles.collectionImageContainer}>
        <VStack className={styles.collectionCoverImageContainer}>
          <Image
            alt="cover"
            src={getCoverImage(collectionAddress)}
            className={styles.collectionCoverImage}
          ></Image>
        </VStack>
        <Image
          alt="profile"
          src={collMetadata.image}
          className={styles.collectionProfileImage}
        ></Image>
      </VStack>
      <VStack className={styles.titleTextContainer}>
        <Text className={styles.title}>{collMetadata.name}</Text>
        <HStack>
          <Text className={styles.username}>By</Text>
          <Image
            alt="user"
            src="/user.png"
            className={styles.userImage}
          ></Image>
          <Text className={styles.username}>TP6D...UBPq</Text>
        </HStack>
        <Text className={styles.subtitle}>{collMetadata.description}</Text>
        <HStack className={styles.statsContainer}>
          <HStack>
            <Text className={styles.attribute}>Total volume</Text>
            <Image alt="tron" src="/tron.png" className={styles.csc}></Image>
            <Text className={styles.attributeBold}>
              <Text fontWeight={700} as="span">
                2K
              </Text>{" "}
              ·
            </Text>
          </HStack>
          <HStack>
            <Text className={styles.attribute}>Floor price</Text>
            <Image alt="tron" src="/tron.png" className={styles.csc}></Image>
            <Text>
              <Text fontWeight={700} as="span">
                150.00
              </Text>{" "}
              ·
            </Text>
          </HStack>
          <Text className={styles.attribute}>
            Items{" "}
            <Text fontWeight={700} as="span">
              {numAssets}
            </Text>{" "}
            · Created{" "}
            <Text fontWeight={700} as="span">
              Oct 2022
            </Text>
          </Text>
        </HStack>
      </VStack>
      <Box className={styles.divider}></Box>
      <HStack className={styles.sectionTitleContainer}>
        <Text className={styles.sectionTitle}>{numAssets} items</Text>
      </HStack>
      <SimpleGrid columns={4} w="100%" gap="1rem">
        {!isLoaded
          ? tokenMetadata
              .slice(0, 8)
              .map(({ metadata, tokenId }, idx) => (
                <ImageContainer
                  key={idx}
                  image={metadata.image_url}
                  title={metadata.name}
                  subtitle={metadata.collection}
                  h="300px"
                  link={`/collection/${collectionAddress}/${tokenId}`}
                />
              ))
          : tokenMetadata.map(({ metadata, tokenId }, idx) => (
              <ImageContainer
                key={idx}
                image={metadata.image_url}
                title={metadata.name}
                subtitle={metadata.collection}
                link={`/collection/${collectionAddress}/${tokenId}`}
              />
            ))}
      </SimpleGrid>
      <VStack pt="2rem">
        {tokenMetadata.length < 8 ||
          (!isLoaded && (
            <Button
              className={styles.landingBtn}
              onClick={() => setLoaded(true)}
            >
              Load more
            </Button>
          ))}
      </VStack>
    </VStack>
  );
}

export default Collection;
