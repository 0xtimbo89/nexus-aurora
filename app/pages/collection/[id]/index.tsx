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
import { useContractRead } from "wagmi";
import NexusNFT from "@data/NexusNFT.json";
import { useMemo } from "react";
import { BigNumber } from "ethers";
import { abridgeAddress } from "@utils/abridgeAddress";

function getCoverImage(address) {
  switch (address) {
    case "0x80E526b6bA7aB2C9Ad89Bc88E241a2D23D425F73":
      return "/journey.jpg";
    case "0x0A197D7FF08a8110eC41e0934C69159505eF5A6D":
      return "/slenderman.jpg";
    case "0x2506d1Ac00DfA924998ebc78C704E33E66a731D4":
      return "/pokemon.jpg";
    case "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276":
      return "/cover.jpg";
    case "0x9D2a3158c9629a610e4885a23bcFD5B1ad8ca804":
      return "/nexus.jpg";
    default:
      return "/cover.png";
  }
}

function Collection() {
  const router = useRouter();
  const { id: collectionAddress } = router.query;
  const [collMetadata, setCollMetadata] = useState<any>();
  const [tokenMetadata, setTokenMetadata] = useState<any[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);

  const { data: URI } = useContractRead({
    address:
      (collectionAddress as string) ??
      "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276",
    abi: NexusNFT.abi,
    functionName: "getCollectionURI",
  });

  const { data: tokenId } = useContractRead({
    address:
      (collectionAddress as string) ??
      "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276",
    abi: NexusNFT.abi,
    functionName: "getLastTokenId",
  });

  const fetchCollection = useCallback(async () => {
    if (!URI) return;
    const response = await fetch(URI as string);
    const result = await response.json();

    setCollMetadata(result);
  }, [URI]);

  const numAssets = useMemo(
    () => (tokenId ? (tokenId as BigNumber).toNumber() : 0),
    [tokenId]
  );

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
      fetchCollection();
    }
    if (numAssets) {
      fetchTokenInfo();
    }
  }, [URI, tokenId, fetchTokenInfo, numAssets]);

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
          <Text className={styles.username}>
            {abridgeAddress(collMetadata.creator)}
          </Text>
        </HStack>
        <Text className={styles.subtitle}>{collMetadata.description}</Text>
        <HStack className={styles.statsContainer}>
          <HStack>
            <Text className={styles.attribute}>Total volume</Text>
            <Image
              alt="aurora"
              src="/aurora.png"
              className={styles.csc}
            ></Image>
            <Text className={styles.attributeBold}>
              <Text fontWeight={700} as="span">
                2K
              </Text>{" "}
              ·
            </Text>
          </HStack>
          <HStack>
            <Text className={styles.attribute}>Floor price</Text>
            <Image
              alt="aurora"
              src="/aurora.png"
              className={styles.csc}
            ></Image>
            <Text>
              <Text fontWeight={700} as="span">
                0.001 aETH
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
              Nov 2022
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
